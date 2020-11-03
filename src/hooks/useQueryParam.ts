import { useState } from 'preact/hooks';

const handleParam = (key: string, value?: any) => {
  // Required for SSR. Do nothing if location object is not available.
  if (typeof location !== `undefined`) {
    // historyMethod: push or replace (https://developer.mozilla.org/docs/Web/API/History)
    // to either add to the browser history or replace the last item
    // Parse current query string using the browser's URLSearchParams API.
    const params = new URLSearchParams(location.search);
    // If the passed value is undefined, check if the URL already contains
    // a value for it. This is important on initial page load.
    if (value === undefined) value = params.get(key);
    // If the passed value is null and the nullDeletes option is
    // set to true, delete the corresponding query parameter.
    else if (value === null) params.delete(key);
    // Else use the provided key and value to set a new query parameter.
    else params.set(key, value);
    // Construct URL containing the updated query parameter(s).
    let target = location.pathname + `?` + params.toString();
    target = target.replace(/\/?\?$/, ``); // remove ? if search string is empty
    history[`replaceState`]({ path: value }, ``, target); // update the browser URL
    return value;
  }
};

export const useQueryParam = (key: string, value?: any) => {
  // Relies on useState to trigger component rerenders on calls to setParam.
  const [param, setParam] = useState(handleParam(key, value));
  // override allows changing options for individual setQueryParam calls
  const setter = (newValue: any) => setParam(handleParam(key, newValue));
  return [param, setter];
};
