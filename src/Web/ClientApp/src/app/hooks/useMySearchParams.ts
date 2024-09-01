
export const useMySearchParams = () => {
  const params: Map<string,string> = new Map();
  let query = window.location.search;
  if(query.startsWith("?"))
    query = query.substring(1);
  const pairs = query.split("&");
  for(let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1]);
    params.set(key, value);
  }
  return params;
}