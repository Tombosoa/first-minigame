const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.getElementById('scoreEl')
const startGame = document.getElementById('startGame')
const modalEl = document.getElementById('modalEl')
const bigScore = document.getElementById('bigScore')

class Player {
    constructor(x, y, radius, { velocity }, { image }) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.image = image
    }
    draw() {
        c.beginPath()
        c.drawImage(this.image, this.x - 50, this.y - 50)
        c.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }



    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    static width = 40
    static height = 40
    constructor({ x, y, radius, velocity, image }) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.image = image
    }



    draw() {
        c.beginPath()
        c.fill()
        c.drawImage(this.image, this.x - 60, this.y - 50)
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


const keys = {
    e: {
        pressed: false
    },
    f: {
        pressed: false
    },
    c: {
        pressed: false
    },
    s: {
        pressed: false
    }
}

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}
let projectiles = []
let enemies = []


function initGame() {
    player = new Player(canvas.width / 2, canvas.height / 2, 30, {
        velocity: {
            x: 0,
            y: 0
        }
    }, { image: createImage('./img/vaisseau.png') })
    projectiles = []
    enemies = []
    score = 0
    scoreEl.innerHTML = score
}


function spawEnemies() {
    setInterval(function () {
        const radius = 50

        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)

        const velocity = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3
        }
        enemies.push(new Enemy({ x, y, radius, velocity, image: createImage('./img/t26Llb1.png') }))
    }, 1000)
}

let player
function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 30, {
        velocity: {
            x: 0,
            y: 0
        }
    }, { image: createImage('./img/vaisseau.png') })
}


let animationId
let score = 0


function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'rgba(0,0,0,0.1)'
    projectiles.forEach(function (projectile) {
        projectile.update()
    })

    player.velocity.y = 0
    player.velocity.x = 0

    if (keys.e.pressed) {
        player.velocity.y = -5
    }
    else if (keys.f.pressed) {
        player.velocity.x = 5
    }
    else if (keys.c.pressed) {
        player.velocity.y = 5
    }
    else if (keys.s.pressed) {
        player.velocity.x = -5
    }

    player.update()

    enemies.forEach(function (enemy, index) {
        enemy.update()


        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScore.innerHTML = score
        }

        projectiles.forEach(function (projectile, projectileIndex) {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist - enemy.radius - projectile.radius < 1) {
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
                score += 100
                scoreEl.innerHTML = score
            }
        })
    })
}

addEventListener("click", function (e) {
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x)
    const velocity = {
        x: Math.cos(angle) * 15,
        y: Math.sin(angle) * 15
    }
    projectiles.push(new Projectile(player.x, player.y, 5, 'orange', velocity))
})


startGame.addEventListener('click', function () {
    initGame()
    init()
    animate()
    spawEnemies()
    modalEl.style.display = 'none'
})

window.addEventListener('keydown', function ({ key }) {
    switch (key) {
        case 'e':
            keys.e.pressed = true
            lastKey = 'e'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 'q'
            break
        case 'c':
            keys.c.pressed = true
            lastKey = 'x'
            break
        case 'f':
            keys.f.pressed = true
            lastKey = 'f'
            break
    }
})

window.addEventListener('keyup', function ({ key }) {
    switch (key) {
        case 'e':
            keys.e.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'c':
            keys.c.pressed = false
            break
        case 'f':
            keys.f.pressed = false
            break
    }
})