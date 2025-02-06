// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.0/src/Shox.js"

export const TexFrag = `#version 300 es
	precision mediump float;

	uniform vec2 texelSize;
	uniform vec2 canvasSize;

	${Shox.noiseMath}
	${Shox.snoise3D}
	${Shox.snoise3DImage}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;

		float noise = 1.;
		noise *= 1.-.02*snoise3DImage(uv*vec2(.05, 1.), 200., 1.5, .5, vec3(0.)).r;
		noise *= 1.-.02*snoise3DImage(uv*vec2(1., .05), 200., 1.5, .5, vec3(0.)).r;
		noise *= 1.-.02*snoise3DImage(uv*vec2(1.,  1.),  10., 1.5, .5, vec3(0.)).r;

		fragColor = vec4(vec3(noise)*vec3(1., .95, .95), 1.);
		fragColor *= fragColor;
	}
`

export const BlurFrag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform vec2 mouse;
	uniform float time;
	uniform float scale;
	uniform vec2 direction;

	${Shox.blur(3)}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;
		float weight = smoothstep(1.5, 0., length(uv-mouse)*scale);
		vec4 o = texture(tex0, uv);
		vec4 b = blur(uv, tex0, texelSize, direction);
		fragColor = mix(o, b, weight);
	}
`

export const GrainFrag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform vec2 mouse;
	uniform float time;
	uniform float scale;

	${Shox.displace}
	${Shox.hash}

	float brightness(vec3 color) {
		return dot(color, vec3(0.2126, 0.7152, 0.0722));
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;
		float weight = smoothstep(1.5, 0., length(uv-mouse)*scale);
		vec2 hash = (2.*hash22(uv*31415.926)-1.)*weight;
		vec2 duv = displace(uv, hash, 0., .02);
		vec3 col = texture(tex0, duv).rgb;
		fragColor = vec4(vec3(brightness(col)), 1.);
	}
`

export const MixFrag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform sampler2D tex1;
	uniform vec3 color;

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;
		vec4 base = texture(tex0, uv);
		vec4 blend = texture(tex1, uv);
		fragColor = mix(base, vec4(color, 1.), blend.r);
	}
`

export const vert = `#version 300 es

	in vec4 aPosition;
	in vec2 aTexCoord;

	out vec2 vTexCoord;

	void main() {
		vTexCoord = aTexCoord;
		gl_Position = aPosition;
	}
`
