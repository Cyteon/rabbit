export const load = ({ params }) => {
  return {
    slug: params.slug,
    post: params.post,
  };
};
