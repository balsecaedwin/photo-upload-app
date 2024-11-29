

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Boa52Hkq.js","_app/immutable/chunks/disclose-version.BCVyhbI3.js","_app/immutable/chunks/runtime.Bqt1P_Xy.js"];
export const stylesheets = [];
export const fonts = [];
