export const COLOR_SCHEME_STORAGE_KEY = "mitos-theme";

// Runs in <head> before first paint, so a stored choice never flashes the system scheme.
export const COLOR_SCHEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${COLOR_SCHEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
