export default function middleware(request) {
  // You can add Vercel-specific middleware logic here
  // This is similar to what your Netlify edge function might be doing
  return new Response(null, {
    status: 200,
  });
}

export const config = {
  matcher: '/*',
};
