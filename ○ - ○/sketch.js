let mic
let fft
let amp
let ease
let easing = 0.05
let eye_frame
let eye_flag
let eye_size
let parts_size
let level_list = []
let x = 0
let y = 0
let mx = 0
let my = 0
let mouse_s = 150
let ms = 150
let osc
let osc_playing 
let freq
let current_mouth_size
let c

function setup(){
	userStartAudio()
	
  let cnv = createCanvas(windowWidth,windowHeight)

	//マイク追加
	mic = new p5.AudioIn()
  mic.start()
	
	//キャンバスをクリック中はオシレーターが発音
  cnv.mousePressed(playOscillator)
  osc = new p5.Oscillator('sine')

	//fft追加
	fft = new p5.FFT(0.8, 512)
	fft.setInput(mic)
	fft.setInput(osc)
	
	//each setting
	c = color(0, 0, 0)
  background(c)
	rectMode(CENTER)
	eye_flag = false
	parts_size = width * 0.09
	eye_size = parts_size
	current_mouth_size = 0.0
	colorMode(HSB, 360, 100, 100, 100)
	textFont("Spartan")
	textAlign(RIGHT, TOP)
}

function draw() {
	
	//各種音データ取得
	let spectrum = fft.analyze()
	let level = mic.getLevel()
	
	
	//オシレーター制御
	freq = constrain(map(mouseX, 0, width, 100, 3000), 100, 3000)
  if (osc_playing) {
		amp = constrain(map(mouseY, height, 0, 0, 1), 0, 1)
		c = color(map(freq, 100, 3000, 240, 0), 80, amp * 100, 100)
    osc.freq(freq, 0.1)
    osc.amp(amp, 0.1)
  } else {
		amp = 0
	}
	
	
	//mouse ease化
	let targetX = mouseX
  let dx = targetX - x
  x += dx * easing

  let targetY = mouseY
  let dy = targetY - y
  y += dy * easing
	
	//background
  background(c)
  noStroke()

	
	//周波数
	let hlz = constrain(spectrum.indexOf(Math.max.apply(null,spectrum)), 0, 64)
	textSize(Math.min(width, height) / 4)
	fill(hue(c), 70, lightness(c), 30)
  text(Math.floor(hlz * 46.875) + "Hz", width, 0)

	
	//背後の座布団
	fill(0, 0, 100, 10)
	push()
	translate((x - width / 2) * 0.03, (y - height / 2) * 0.03)
	rect(width / 2, height / 2, width - 120, height - 120, Math.min(width, height) * 0.05)
	pop()
	
	//eye setting
	fill(0, 0, 100, 100)
	if(random() < 0.01 && !eye_flag) {
		eye_flag = true
		eye_frame = 0
	}
	if(eye_flag) {
		eye_size = map(ExpoEaseOut(eye_frame, 0, 1, 1), 0, 1, 30, parts_size)
		eye_frame += 1 / 10.0
		if (eye_frame > 1) {
			eye_frame = 0
			eye_flag = false
		}
	} else {
		eye_size = parts_size
	}
	
	//left eye
	push()
	translate((x - (width / 2 - Math.max(width * 0.18, 100))) * 0.2, (y - height / 2) * 0.3)
	rect(width / 2 - Math.max(width * 0.18, 100), height / 2, parts_size, eye_size, parts_size / 2)
	pop()
	//right eye
	push()
	translate((x - (width / 2 + Math.max(width * 0.18, 100))) * 0.2, (y - height / 2) * 0.3)
	rect(width / 2 + Math.max(width * 0.18, 60), height / 2, parts_size, eye_size, parts_size / 2)
	pop()

	
	//mouth setting
	let mouth_size = mouthCtrl(level, amp)
	let ds = mouth_size - current_mouth_size
	current_mouth_size += ds * 0.1
	let mouth_width = constrain(map(current_mouth_size, 0, 1, width * 0.04, 160), 80, 180)
	let mouth_height = constrain(map(current_mouth_size, 0, 1, mouth_width * 0.2, height * 0.4), 20, height * 0.4)
	
	push()
	translate((x - width / 2) * 0.2, (y - height / 2 + mouth_height * 0.4) * 0.3)
	rect(width / 2, height / 2 + mouth_height * 0.4, mouth_width, mouth_height, 20)
	pop()
	
	
	//スペクトラム
	fill(0, 0, 100, 80)
  for (let i = 2; i < 64; i++) {
		let vel = map(Math.pow(spectrum[i], 2), 0, Math.pow(255, 2), 0, height)
		rect(map(i, 2, 64, 0, width), height - vel / 2, 1, vel, 0.5, 0.5, 0, 0)
	}
	
	
	//マウス場所
	let targetX_ = mouseX
  let dx_ = targetX_ - mx
  mx += dx_ * 0.2

  let targetY_ = mouseY
  let dy_ = targetY_ - my
  my += dy_ * 0.2
	
	let dm = mouse_s - ms
	ms += dm * 0.1
	
	fill(0, 0, 100, 20)
	ellipse(mx, my, ms, ms)
	
}

function ExpoEaseOut(t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b
}

function mouthCtrl(v1, v2) {
	return Math.max(ExpoEaseOut(v1, 0, 1, 1), v2)
}

function playOscillator() {
	mouse_s = 30
  osc.start()
  osc_playing = true
}

function mouseReleased() {
	mouse_s = 150
  osc.amp(0, 0.5)
  osc_playing = false
}






