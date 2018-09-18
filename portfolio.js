window.onload = function() {
  //マスク
  let all_mask = document.body.appendChild(document.createElement("div"))
  all_mask.id = "all_mask"
  let mask_style = all_mask.style
  mask_style.backgroundColor = "white"
  let mask_opacity = 1
  mask_style.opacity = mask_opacity
  let opacity_down = function() {
    mask_opacity -= 0.005
    mask_style.opacity = mask_opacity
  }
  mask_style.height = "100vh"
  mask_style.width = "100vw"
  mask_style.position = "fixed"
  mask_style.top = 0
  let clearMask = setInterval(function() {
    opacity_down()
    if(mask_opacity < 0){
      clearInterval(clearMask)
    }
  }, 10)
  
  let top1 = document.getElementById("ele")
  let front = document.getElementById("front-parts").style
  let mouseX
  let mouseY

  //マウス座標取得
  document.body.addEventListener("mousemove", function(e){
    mouseX = e.pageX
    mouseY = e.pageY
  })

  //動的に変更
  setInterval(function(){
    let eyeMX = mouseX - window.innerWidth / 2
    let eyeMY = -(mouseY - 240)
    
    let x, y
    if(Math.sqrt(Math.pow(eyeMX, 2)+Math.pow(eyeMY, 2))>100){
      x = Math.cos(Math.atan2(eyeMY, eyeMX))*45
      y = -Math.sin(Math.atan2(eyeMY, eyeMX))*45 + 20
    } else {
      x = Math.cos(Math.acos(eyeMX/100))*45
      y = -Math.sin(Math.asin(eyeMY/100))*45 + 20
    }

    let scale
    let length = Math.sqrt(Math.pow(x, 2)+Math.pow(y-20, 2))
    if(length>0&&length<=65){scale = -length/130 + 1} else if(length==0){scale = 1} else {scale = length/130 + 1}

    SetTransform(front, `translate(${x}px, ${y}px)`)
  }, 10)

  //transform
  function SetTransform(style,value){
		var list = ["transform","webkitTransform","MozTransform","msTransform","OTransform"];
		for(let i=0;i < list.length;i++){
			if(style[list[i]] !== undefined){
				style[list[i]] = value;
				return true;
			}
		}
		return false;
	}
}
