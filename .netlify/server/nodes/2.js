

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.B77WwTur.js","_app/immutable/chunks/disclose-version.BCVyhbI3.js","_app/immutable/chunks/runtime.Bqt1P_Xy.js","_app/immutable/chunks/legacy.DcjfDcKp.js","_app/immutable/chunks/events.CtXg2VJX.js"];
export const stylesheets = ["_app/immutable/assets/2.M_6i5-bQ.css"];
export const fonts = [];
