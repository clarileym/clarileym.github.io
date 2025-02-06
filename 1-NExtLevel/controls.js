// MIT License
// Copyright © 2024 Zaron Chen
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const LOOP_TOGGLE = {
	STATE: true,
	BY_CLICK: false,
	BY_PRESS: false,
	KEY: " ",
	p5: null,
	toggle: () => {
		LOOP_TOGGLE.STATE = !LOOP_TOGGLE.STATE
		LOOP_TOGGLE.STATE ? LOOP_TOGGLE.p5.loop() : LOOP_TOGGLE.p5.noLoop()
	},
}

const CLICK_TOGGLE_LIST = []
const PRESS_TOGGLE_LIST = []
const createToggle = (key, func1, func1Args = [], func2, func2Args = []) => {
	let state = true
	return {
		key,
		toggle: () => {
			state = !state
			return state ? func1(...func1Args) : func2(...func2Args)
		},
	}
}

const CLICK_DO_LIST = []
const PRESS_DO_LIST = []
const createDo = (key, func, args = []) => ({
	key,
	run: () => func(...args),
})

const ClickLoopToggle = (p5 = null) => {
	LOOP_TOGGLE.BY_CLICK = true
	LOOP_TOGGLE.p5 = p5
}

const ClickToggle = (func1, func2, func1Args = [], func2Args = []) =>
	CLICK_TOGGLE_LIST.push(
		createToggle("CLICK", func1, func1Args, func2, func2Args)
	)

const ClickDo = (func, args = []) =>
	CLICK_DO_LIST.push(createDo("CLICK", func, args))

document.addEventListener("mousedown", () => {
	if (LOOP_TOGGLE.BY_CLICK) LOOP_TOGGLE.toggle()
	CLICK_TOGGLE_LIST.forEach((toggle) => toggle.toggle())
	CLICK_DO_LIST.forEach((item) => item.run())
})

const PressLoopToggle = (p5, key) => {
	LOOP_TOGGLE.BY_PRESS = true
	LOOP_TOGGLE.KEY = key
	LOOP_TOGGLE.p5 = p5
}

const PressToggle = (key, func1, func2, func1Args = [], func2Args = []) =>
	PRESS_TOGGLE_LIST.push(createToggle(key, func1, func1Args, func2, func2Args))

const PressDo = (key, func, args = []) =>
	PRESS_DO_LIST.push(createDo(key, func, args))

document.addEventListener("keydown", (event) => {
	const key = event.key
	if (key === LOOP_TOGGLE.KEY) {
		if (LOOP_TOGGLE.BY_PRESS) LOOP_TOGGLE.toggle()
	}
	PRESS_TOGGLE_LIST.forEach((toggle) => {
		if (key === toggle.key) toggle.toggle()
	})
	PRESS_DO_LIST.forEach((item) => {
		if (key === item.key) item.run()
	})
})

/**
 * Mount Control to p5
 * @param {p5} p5 - p5
 */
export const mountControl = (p5) => {
	/**
	 * ClickLoopToggle
	 */
	p5.prototype.ClickLoopToggle = function () {
		ClickLoopToggle(this)
	}

	/**
	 * ClickToggle
	 * @param { Function } func1 - function 1
	 * @param { Function } func2 - function 2
	 * @param { Array } func1Args - function 1 args
	 * @param { Array } func2Args - function 2 args
	 */
	p5.prototype.ClickToggle = function (
		func1,
		func2,
		func1Args = [],
		func2Args = []
	) {
		ClickToggle(func1, func2, func1Args, func2Args)
	}

	/**
	 * ClickDo
	 * @param { Function } func - function
	 * @param { Array } args - args
	 */
	p5.prototype.ClickDo = function (func, args = []) {
		ClickDo(func, args)
	}

	/**
	 * PressLoopToggle
	 * @param { String } key - key
	 */
	p5.prototype.PressLoopToggle = function (key) {
		PressLoopToggle(this, key)
	}

	/**
	 * PressToggle
	 * @param { String } key - key
	 * @param { Function } func1 - function 1
	 * @param { Function } func2 - function 2
	 * @param { Array } func1Args - function 1 args
	 * @param { Array } func2Args - function 2 args
	 */
	p5.prototype.PressToggle = function (
		key,
		func1,
		func2,
		func1Args = [],
		func2Args = []
	) {
		PressToggle(key, func1, func2, func1Args, func2Args)
	}

	/**
	 * PressDo
	 * @param { String } key - key
	 * @param { Function } func - function
	 * @param { Array } args - args
	 */
	p5.prototype.PressDo = function (key, func, args = []) {
		PressDo(key, func, args)
	}
}
