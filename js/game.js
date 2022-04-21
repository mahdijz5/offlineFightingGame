const background = new Environment({
	position: {
		x: 0,
		y: 0,
	},
	height: canvas.height,
	width: canvas.width,
	imageSrc: "./img/background.png",
});

const player = new Champion({
	name: "player",
	position: {
		x: 20,
		y: 0,
	},
	vlocity: {
		x: 0,
		y: 0,
	},
	imageSrc: "./img/darkWizard/idle.png",
	frameMax: 6,
	offset: {
		x: 145,
		y: 94,
	},
	scale : 2,

	attackbox : {
		height : 78 ,
		width : 120,
		offset : {
			x: 20,
			y:-20,
		},
	},

	champions: {
		idle: {
			imageSrc: "./img/darkWizard/idle.png",
			frameMax: 10,
		},
		run: {
			imageSrc: "./img/darkWizard/run.png",
			frameMax: 8,
		},
		fall : {
			imageSrc :"./img/darkWizard/fall.png",
			frameMax : 3,
		},
		jump : {
			imageSrc :"./img/darkWizard/jump.png",
			frameMax : 3,
		},
		attack2 : {
			imageSrc :"./img/darkWizard/attack2.png",
			frameMax : 7,
		},
		death : {
			imageSrc :"./img/darkWizard/death.png",
			frameMax : 7,
		},
		hit : {
			imageSrc :"./img/darkWizard/hit.png",
			frameMax : 3,
		},
		reverseRun : {
			imageSrc :"./img/darkWizard/reverseRun.png",
			frameMax : 8,
		},
	},
});

console.log(player);

player.draw();

const enemy = new Champion({
	name: "enemy",
	position: {
		x: 960,
		y: 0,
	},
	vlocity: {
		x: 0,
		y: 0,
	},
	imageSrc: "./img/darkKnight/idle.png",
	frameMax: 8,
	scale: 1.9,
	offset: {
		x: 125,
		y: 85,
	},
	attackbox : {
		height : 50 ,
		width : 100,
		offset : {
			x:100,
			y:-18,
		},
	},
	champions: {
		idle: {
			imageSrc: "./img/darkKnight/idle.png",
			frameMax: 8,
		},
		run: {
			imageSrc: "./img/darkKnight/run.png",
			frameMax: 8,
		},
		reverseRun : {
			imageSrc: "./img/darkKnight/runForward.png",
			frameMax: 8,

		},
		fall : {
			imageSrc :"./img/darkKnight/fall.png",
			frameMax : 2,
		},
		jump : {
			imageSrc :"./img/darkKnight/jump.png",
			frameMax : 2,
		},
		hit : {
			imageSrc :"./img/darkKnight/hit.png",
			frameMax : 4,
		},
		death : {
			imageSrc :"./img/darkKnight/death.png",
			frameMax : 6,
		},
		attack2 : {
			imageSrc :"./img/darkKnight/attack2.png",
			frameMax : 4,
		},
	},
});

enemy.draw();

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowDown: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
};

timer();


const renderer = () => {
	window.requestAnimationFrame(renderer);
	(c.fillStyle = "black"), c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	enemy.update();
	player.update();

	player.vlocity.x = 0;
	enemy.vlocity.x = 0;

	//!Die animation
	if(enemy.health <= 0) {
		enemy.die()
		
	}
	if(player.health <= 0) {
		player.die()
		
	}


	// !player movement
	if (keys.a.pressed && player.lastKey == "a") {
		if (worldBorder(player).a) player.vlocity.x = -6;
		player.animation('reverseRun')
	}else if (keys.d.pressed && player.lastKey == "d") {
		if (worldBorder(player).d) player.vlocity.x = 6;
		player.animation('run')
	}else{
		player.animation('idle')
	}

	// !enemy movement
	if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
		if (worldBorder(enemy).ArrowRight) enemy.vlocity.x = 6;
		enemy.animation('run')
	} else if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
		if (worldBorder(enemy).ArrowLeft) enemy.vlocity.x = -6;
		enemy.animation('reverseRun')
	}else {
		enemy.animation('idle')
	}

	//!detect colision
	if (detectCondition({ playerOne : player, playerTwo: enemy }) && player.isAttacking) {
		console.log("player has attacked");
		enemy.takeHit()
		player.isAttacking = false;
	}
	if (detectCondition({ playerOne : enemy, playerTwo: player }) && enemy.isAttacking) {
		console.log("enemy has attacked");
		player.takeHit()
		enemy.isAttacking = false;
	}
	// document.querySelector("#enemyHealthBar").style.width = enemy.health + "%";
	// document.querySelector("#playerHealthBar").style.width = player.health + "%";
	gsap.to("#enemyHealthBar" , {
		width : enemy.health + "%"
	})
	gsap.to("#playerHealthBar" , {
		width : player.health + "%"
	})

	if (player.health == 0) {
		showWinner("Enemy won");
	} else if (enemy.health == 0) {
		showWinner("Player won");
	}

	//! Animation
	
if (player.vlocity.y < 0) {
	player.animation("jump");
}else if(player.vlocity.y  > 0) {
	player.animation("fall");
}
if (enemy.vlocity.y < 0) {
	enemy.animation("jump");
}else if(enemy.vlocity.y  > 0) {
	enemy.animation("fall");
}

};

renderer();

window.addEventListener("keydown", (event) => {
	if(enemy.dead || player.dead) return
		switch (event.key) {
		case "a":
			player.lastKey = "a";
			keys.a.pressed = true;
			break;
		case "d":
			player.lastKey = "d";
			keys.d.pressed = true;
			break;
		case "w":
			if (player.position.y >= 426) {
				player.vlocity.y = -20;
			}
			break;
		case " ":
			player.attack()
			break;
		case "ArrowRight":
			enemy.lastKey = "ArrowRight";
			keys.ArrowRight.pressed = true;
			break;
		case "ArrowLeft":
			enemy.lastKey = "ArrowLeft";
			keys.ArrowLeft.pressed = true;
			break;
		case "ArrowUp":
			if (enemy.position.y >= 426) {
				enemy.vlocity.y = -20;
			}
			break;
		case "ArrowDown":
			enemy.attack()
			break;
	}
});

window.addEventListener("keyup", (event) => {
	switch (event.key) {
		case "a":
			keys.a.pressed = false;
			break;
		case "d":
			keys.d.pressed = false;
			break;
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;

		case "a":
			enemy.lastKey = "a";
			break;
	}
});
