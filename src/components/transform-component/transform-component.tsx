/* eslint-disable react/require-default-props */
import React, { useContext, useEffect, useRef } from "react";

import { baseClasses } from "../../constants/state.constants";
import { Context } from "../transform-wrapper/transform-wrapper";

import styles from "./transform-component.module.css";

type Props = {
  children: React.ReactNode;
  wrapperClass?: string;
  contentClass?: string;
  wrapperStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;

  // Set to true if you want to render InnerTransformedContent yourself inside of childern.
  // Do this if you want to separate the event target area from the transformed content. Wrap the content to transform in InnerTransformedContent.
  // Otherwise it will wrap all children.
  // content* props will be ignored if this is set to true—pass them to the InnerTransformedContent component instead.
  childrenIncludesContentWrapper?: boolean;
};

type InnerTransformedContentProps = React.HTMLAttributes<HTMLDivElement>;

const InnerTransformedContentRefContext =
  React.createContext<React.RefObject<HTMLDivElement> | null>(null);

/**
 * This component wraps the content to be transformed
 * @param param0
 * @returns
 */
export const InnerTransformedContent = ({
  className,
  children,
  ...props
}: InnerTransformedContentProps) => {
  const contextRef = useContext(InnerTransformedContentRefContext);
  return (
    <div
      {...props}
      ref={contextRef}
      className={`${baseClasses.contentClass} ${styles.content} ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * This component provides the event-capturing container.
 * The children are the content to be transformed. In you don't want all children to be transformed, set `childrenIncludesContentWrapper` to true and wrap childern to transform in InnerTransformedContent.
 * @param param0
 * @returns
 */
export const TransformComponent: React.FC<Props> = ({
  wrapperClass = "",
  wrapperStyle,
  wrapperProps = {},
  contentClass,
  contentProps,
  contentStyle,
  children,
  childrenIncludesContentWrapper = false,
}: Props) => {
  const { init, cleanupWindowEvents } = useContext(Context);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (wrapper !== null && content !== null && init) {
      init?.(wrapper, content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      cleanupWindowEvents?.();
    };
  }, []);

  return (
    <div
      {...wrapperProps}
      ref={wrapperRef}
      className={`${baseClasses.wrapperClass} ${styles.wrapper} ${wrapperClass}`}
      style={wrapperStyle}
    >
      <InnerTransformedContentRefContext.Provider value={contentRef}>
        {childrenIncludesContentWrapper ? (
          children
        ) : (
          <InnerTransformedContent
            className={contentClass}
            style={contentStyle}
            {...contentProps}
          >
            {children}
          </InnerTransformedContent>
        )}
      </InnerTransformedContentRefContext.Provider>
    </div>
  );
};
