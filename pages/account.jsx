import Head from 'next/head';
import { supabase } from '../utils/supabase-client';

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return { props: {}, redirect: { destination: '/sign-in' } };
  }
  return { props: { user } };
}

export default function Account({ user }) {
  return (
    <>
      <Head>
        <title>Account | Pennyseed</title>
      </Head>
      <div className="mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Account
          </span>
        </h1>
        <p className="mt-8 text-xl leading-8 text-gray-500">
          Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At
          arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae
          feugiat egestas ac. Diam nulla orci at in viverra scelerisque eget.
          Eleifend egestas fringilla sapien.
        </p>
      </div>
      <div className="prose prose-lg prose-yellow mx-auto mt-6 text-gray-500">
        <p>
          Faucibus commodo massa rhoncus, volutpat. <strong>Dignissim</strong>{' '}
          sed <strong>eget risus enim</strong>. Mattis mauris semper sed amet
          vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus
          viverra tellus varius sit neque erat velit. Faucibus commodo massa
          rhoncus, volutpat. Dignissim sed eget risus enim.{' '}
          <a href="#">Mattis mauris semper</a> sed amet vitae sed turpis id.
        </p>
        <ul>
          <li>Quis elit egestas venenatis mattis dignissim.</li>
          <li>Cras cras lobortis vitae vivamus ultricies facilisis tempus.</li>
          <li>Orci in sit morbi dignissim metus diam arcu pretium.</li>
        </ul>
        <p>
          Quis semper vulputate aliquam venenatis egestas sagittis quisque orci.
          Donec commodo sit viverra aliquam porttitor ultrices gravida eu.
          Tincidunt leo, elementum mattis elementum ut nisl, justo, amet,
          mattis. Nunc purus, diam commodo tincidunt turpis. Amet, duis sed elit
          interdum dignissim.
        </p>
        <h2>From beginner to expert in 30 days</h2>
        <p>
          Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat
          in. Convallis arcu ipsum urna nibh. Pharetra, euismod vitae interdum
          mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
          tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi.
          Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis
          diam.
        </p>
        <blockquote>
          <p>
            Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum
            urna sed consectetur neque tristique pellentesque. Blandit amet, sed
            aenean erat arcu morbi.
          </p>
        </blockquote>
        <p>
          Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus
          enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor
          praesent donec est. Odio penatibus risus viverra tellus varius sit
          neque erat velit.
        </p>
      </div>
    </>
  );
}
