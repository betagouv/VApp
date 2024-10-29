import { type MDXComponents } from 'mdx/types';
import { Fragment } from 'react';

import { MdxLink } from '@/components/mdx/Link';
import { slugify } from '@/libs/utils/string';

import { CTA } from '@/components/CTA';
import { AnchorLink, getLabelFromChildren } from '@/components/dsfr/client';

export const anchorHeadingMDXComponents: MDXComponents = {
  h1: (props) => <AnchorLink as="h1" anchor={slugify(getLabelFromChildren(props.children))} {...props} />,
  h2: (props) => <AnchorLink as="h2" anchor={slugify(getLabelFromChildren(props.children))} {...props} />,
  h3: (props) => <AnchorLink as="h3" anchor={slugify(getLabelFromChildren(props.children))} {...props} />
};

/**
 * Avoid unauthorized HTML tags inside p tags. (e.g. no p inside p, no div inside p, etc.)
 */
export const paragraphContentMDXComponents: MDXComponents = {
  p: Fragment
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: MdxLink,
    CTA: CTA,
    ...components
  };
}
