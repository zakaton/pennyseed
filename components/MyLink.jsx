import { forwardRef } from 'react';
import Link from 'next/link';

const MyLink = forwardRef((props, ref) => {
  const { href, as, children, ...rest } = props;
  return (
    <Link href={href} as={as}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

export default MyLink;
