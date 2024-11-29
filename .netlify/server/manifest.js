export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.CqbBlVqM.js","app":"_app/immutable/entry/app.CWiazrjt.js","imports":["_app/immutable/entry/start.CqbBlVqM.js","_app/immutable/chunks/entry.tJ4wN298.js","_app/immutable/chunks/runtime.Bqt1P_Xy.js","_app/immutable/entry/app.CWiazrjt.js","_app/immutable/chunks/runtime.Bqt1P_Xy.js","_app/immutable/chunks/store.B81dMkKV.js","_app/immutable/chunks/events.CtXg2VJX.js","_app/immutable/chunks/disclose-version.BCVyhbI3.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
