const head = process.env.NODE_ENV === 'development'? 
'https://localhost:5000': 'https://www.mofaqua.com';

export default (url) => {
  return head + url;
}