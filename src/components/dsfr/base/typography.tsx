import { fr } from '@codegouvfr/react-dsfr';
import { cx, type CxArg } from '@codegouvfr/react-dsfr/tools/cx';
// import { type PropsWithoutChildren } from "@common/utils/types";
// import { buildSpacingClasses, type SpacingProps } from "@design-system/utils/spacing";
import { type ForwardedRef, forwardRef, type PropsWithChildren, type ReactNode } from 'react';

import { buildSpacingClasses, type SpacingProps } from '../utils';
import { boxProps } from './Box';

type TypoVariant = (typeof fr.typography)[number]['selector'];

export type TypographyProps = SpacingProps & {
  children: ReactNode;
  className?: CxArg;
};

const typographyProps = <P extends Omit<TypographyProps, 'children'>>({
  className,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  ...rest
}: P) => ({
  className: cx(fr.cx(buildSpacingClasses({ mt, mr, mb, ml, mx, my, pt, pr, pb, pl, px, py })), className),
  ...rest
});

type HeadingTag = `h${1 | 2 | 3 | 4 | 5 | 6}`;
type HeadingAttributes = PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>;

export type HeadingProps = HeadingAttributes &
  SpacingProps & {
    /** The appearance when it's different from the semantic one */
    as?: HeadingTag;
  };

/**
 * Heading
 *
 * @param as The css style to apply
 *
 * @example <H3 as="h6">Title</H3> // make a h3 looks like a h6
 */
const Heading = ({ as: As, tag: HtmlTag, children, className, ...rest }: HeadingProps & { tag: HeadingTag }) => {
  const as = As ?? HtmlTag;

  return (
    <HtmlTag className={cx(fr.cx(`fr-${as}`), className)} {...rest}>
      {children}
    </HtmlTag>
  );
};
export const H1 = ({ as: As, ...rest }: HeadingProps) => <Heading tag="h1" as={As} {...boxProps(rest)} />;
export const H2 = ({ as: As, ...rest }: HeadingProps) => <Heading tag="h2" as={As} {...boxProps(rest)} />;
export const H3 = ({ as: As, ...rest }: HeadingProps) => <Heading tag="h3" as={As} {...boxProps(rest)} />;
export const H4 = ({ as: As, ...rest }: HeadingProps) => <Heading tag="h4" as={As} {...boxProps(rest)} />;
export const H5 = ({ as: As, ...rest }: HeadingProps) => <Heading tag="h5" as={As} {...boxProps(rest)} />;
export const H6 = ({ as: As, ...rest }: HeadingProps) => <Heading tag="h6" as={As} {...boxProps(rest)} />;

type TextVariant = TypoVariant extends infer R ? (R extends `.fr-text--${infer T}` ? T : never) : never;

type TextAttributes<Inline extends boolean> = Inline extends true
  ? React.HTMLAttributes<HTMLSpanElement>
  : React.HTMLAttributes<HTMLParagraphElement>;

export type TextProps<Inline extends boolean> = TextAttributes<Inline> &
  TypographyProps & {
    inline?: Inline;
    variant?: TextVariant | TextVariant[];
  };

const textProps = ({ variant, ...rest }: Omit<TextProps<boolean>, 'children' | 'inline'>) => {
  const tagProps = typographyProps(rest);
  tagProps.className = cx(tagProps.className, cx(variant && [variant].flat().map((v) => `fr-text--${v}`)));

  return tagProps;
};

/**
 * @see https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-de-l-identite-de-l-etat/typographie/#:~:text=Corps%20de%20texte
 */
export const Text = <Inline extends boolean>({ inline, children, ...rest }: TextProps<Inline>) =>
  inline ? <span {...textProps(rest)}>{children}</span> : <div {...textProps(rest)}>{children}</div>;

/**
 * Ref version of {@link Text}
 */
export const TextRef = forwardRef<HTMLParagraphElement | HTMLSpanElement, TextProps<boolean>>(
  ({ children, inline, ...rest }, ref) =>
    inline === true ? (
      <span {...textProps(rest)} ref={ref}>
        {children}
      </span>
    ) : (
      <p {...textProps(rest)} ref={ref as ForwardedRef<HTMLParagraphElement>}>
        {children}
      </p>
    )
);
TextRef.displayName = 'TextRef';
