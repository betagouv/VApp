import { fr } from '@codegouvfr/react-dsfr';
import { cx, type CxArg } from '@codegouvfr/react-dsfr/tools/cx';
import { forwardRef, type PropsWithChildren } from 'react';

import { buildSpacingClasses, type ResponsiveSpacingProps, type SpacingProps } from '../utils/spacing';

export type BoxProps = PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> &
    ResponsiveSpacingProps &
    SpacingProps & {
      className?: CxArg;
      tag?: 'article' | 'div' | 'footer' | 'p' | 'section';
    }
>;

export const boxProps = ({
  className,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  m,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  p,
  // responsive props
  mtmd,
  mrmd,
  mbmd,
  mlmd,
  mxmd,
  mymd,
  mmd,
  ptmd,
  prmd,
  pbmd,
  plmd,
  pxmd,
  pymd,
  pmd,
  ...rest
}: Omit<BoxProps, 'as'>): React.HTMLAttributes<HTMLDivElement> => ({
  className: cx(
    fr.cx(
      buildSpacingClasses({
        mt,
        mr,
        mb,
        ml,
        mx,
        my,
        m,
        pt,
        pr,
        pb,
        pl,
        px,
        py,
        p,
        mtmd,
        mrmd,
        mbmd,
        mlmd,
        mxmd,
        mymd,
        mmd,
        ptmd,
        prmd,
        pbmd,
        plmd,
        pxmd,
        pymd,
        pmd
      })
    ),
    className
  ),
  ...rest
});

export const Box = ({ tag: HtmlTag = 'div', ...rest }: BoxProps) => <HtmlTag {...boxProps(rest)} />;

export const Section = (props: Omit<BoxProps, 'tag'>) => <Box tag="section" {...boxProps(props)} />;
export const P = (props: Omit<BoxProps, 'tag'>) => <Box tag="p" {...boxProps(props)} />;
export const Article = (props: Omit<BoxProps, 'tag'>) => <Box tag="article" {...boxProps(props)} />;
export const Div = (props: Omit<BoxProps, 'tag'>) => <Box tag="div" {...boxProps(props)} />;
export const Footer = (props: Omit<BoxProps, 'tag'>) => <Box tag="footer" {...boxProps(props)} />;

export const BoxRef = forwardRef<HTMLDivElement, BoxProps>(({ tag: HtmlTag = 'div', ...rest }, ref) => (
  <HtmlTag ref={ref} {...boxProps(rest)} />
));

BoxRef.displayName = 'BoxRef';
