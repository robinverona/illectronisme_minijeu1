console.log('app.js loaded');

// const canvas = document.getElementById('canvas')
// canvas.width = window.innerWidth
// canvas.height = window.innerHeight
const matterContainer = document.querySelector("#matter-container")
const SVG_PATH_SELECTOR = '.matter-path'
const SVG_WIDTH_IN_PX = 100
const SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH = 0.3

let Engine = Matter.Engine, 
    Render = Matter.Render, 
    Runner = Matter.Runner, 
    Bodies = Matter.Bodies, 
    Composite = Matter.Composite, 
    Body = Matter.Body,
    Svg = Matter.Svg, 
    Vector = Matter.Vector,
    Vertices = Matter.Vertices,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint; 

// function createSvgBodies() {
//     const paths = document.querySelectorAll(SVG_PATH_SELECTOR)
// }

let engine = Engine.create()

let render = Render.create({
    element: matterContainer, 
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Mouse interactions
let mouse = Matter.Mouse.create(render.canvas)
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {visible: false}
    }
})
render.mouse = mouse

function createSvgBodies() {
    const paths = document.querySelectorAll(SVG_PATH_SELECTOR)
    paths.forEach((path, index) => {
        let vertices = Svg.pathToVertices(path)
        let scaleFactor = (matterContainer.clientWidth * SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH) / SVG_WIDTH_IN_PX
        vertices = Vertices.scale(vertices, scaleFactor, scaleFactor)
        let svgBody = Bodies.fromVertices(index * SVG_WIDTH_IN_PX + 200, 0, [vertices])
        Composite.add(engine.world, svgBody)
    })
}

// Create geometricals elements
let stack = Matter.Composites.stack(100, 200, 8, 8, 0, 0, function(x, y) {
    // let sides = Math.round(Matter.Common.random(2, 8))
    return Matter.Bodies.polygon(x, y, 4, Matter.Common.random (20, 100))
})

Matter.Composite.add(engine.world, [
    // walls
    // top
    Matter.Bodies.rectangle(0, 0, window.innerWidth, 0, { isStatic: true }),
    // bottom
    Matter.Bodies.rectangle(0, window.innerHeight, window.innerWidth * 2, 1, { isStatic: true }),
    // right
    Matter.Bodies.rectangle(window.innerWidth, 300, 1, window.innerHeight * 2, { isStatic: true }),
    // left
    Matter.Bodies.rectangle(0, 0, 1, window.innerHeight * 2, { isStatic: true })
]);

createSvgBodies()

Matter.World.add(engine.world, [stack, mouseConstraint])

// Matter.Engine.run(engine)
Runner.run(engine)
Matter.Render.run(render)

