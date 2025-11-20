"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

export function YesLadder() {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    // Wait for scripts to load before initializing
    const checkAndInit = () => {
      if (typeof window !== "undefined" && (window as any).THREE && (window as any).gsap && !scriptLoaded.current) {
        scriptLoaded.current = true
        initYesLadder()
      }
    }

    const timer = setInterval(checkAndInit, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const initYesLadder = () => {
    if (!canvasContainerRef.current) return

    class YesLadderClass {
      container: HTMLElement
      stepIndex: number
      totalSteps: number
      questions: string[]
      stairs: any[]
      isAnimating: boolean
      scene: any
      camera: any
      renderer: any
      ambientLight: any
      spotLight: any
      pointLight: any

      constructor(container: HTMLElement) {
        this.container = container
        this.stepIndex = 0
        this.totalSteps = 3

        this.questions = ["Want more clients?", "Want better ROI?", "Ready to grow?"]

        this.stairs = []
        this.isAnimating = false

        this.init()
        this.addEventListeners()
        this.render()
      }

      init() {
        const THREE = (window as any).THREE

        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.FogExp2(0x050505, 0.04)

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 2, 10)
        this.camera.lookAt(0, 1, 0)

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.shadowMap.enabled = true
        this.container.appendChild(this.renderer.domElement)

        this.createLighting()
        this.createEnvironment()
      }

      createLighting() {
        const THREE = (window as any).THREE

        this.ambientLight = new THREE.AmbientLight(0x404040, 1.5)
        this.scene.add(this.ambientLight)

        this.spotLight = new THREE.SpotLight(0xffffff, 1)
        this.spotLight.position.set(5, 20, 10)
        this.spotLight.angle = 0.5
        this.spotLight.penumbra = 0.5
        this.spotLight.castShadow = true
        this.scene.add(this.spotLight)

        this.pointLight = new THREE.PointLight(0x00ff88, 0.5, 20)
        this.pointLight.position.set(-5, 2, 0)
        this.scene.add(this.pointLight)
      }

      createEnvironment() {
        const THREE = (window as any).THREE

        const gridHelper = new THREE.GridHelper(50, 50, 0x222222, 0x111111)
        this.scene.add(gridHelper)

        const planeGeometry = new THREE.PlaneGeometry(100, 100)
        const planeMaterial = new THREE.MeshStandardMaterial({
          color: 0x050505,
          roughness: 0.1,
          metalness: 0.5,
        })
        const plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.rotation.x = -Math.PI / 2
        plane.position.y = -0.1
        this.scene.add(plane)
      }

      createStair(index: number) {
        const THREE = (window as any).THREE
        const gsap = (window as any).gsap

        const stairGroup = new THREE.Group()

        const width = 3 + index * 0.2
        const height = 0.4
        const depth = 1.5

        const x = 0
        const y = index * 1.5
        const z = -index * 2

        stairGroup.position.set(x, y, z)

        const geometry = new THREE.BoxGeometry(width, height, depth)
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xccffdd,
          metalness: 0.1,
          roughness: 0.1,
          transmission: 0.6,
          thickness: 1,
          transparent: true,
          opacity: 0,
        })
        const stairMesh = new THREE.Mesh(geometry, material)
        stairMesh.castShadow = true
        stairMesh.receiveShadow = true
        stairGroup.add(stairMesh)

        const railGeo = new THREE.CylinderGeometry(0.05, 0.05, depth, 8)
        const railMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 })

        const leftRail = new THREE.Mesh(railGeo, railMat)
        leftRail.rotation.x = Math.PI / 2
        leftRail.position.set(-width / 2 + 0.2, 1, 0)
        leftRail.scale.set(0, 0, 0)

        const rightRail = new THREE.Mesh(railGeo, railMat)
        rightRail.rotation.x = Math.PI / 2
        rightRail.position.set(width / 2 - 0.2, 1, 0)
        rightRail.scale.set(0, 0, 0)

        stairGroup.add(leftRail)
        stairGroup.add(rightRail)

        const particleCount = 400
        const pGeo = new THREE.BufferGeometry()
        const pPos = []

        for (let i = 0; i < particleCount; i++) {
          pPos.push(
            (Math.random() - 0.5) * (width + 4),
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * (depth + 4)
          )
        }

        pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3))
        const pMat = new THREE.PointsMaterial({
          color: 0x00ff88,
          size: 0.05,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        })
        const particles = new THREE.Points(pGeo, pMat)
        stairGroup.add(particles)

        this.scene.add(stairGroup)
        this.stairs.push(stairGroup)

        const tl = gsap.timeline()

        tl.to(particles.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 0.5,
          ease: "back.in(1.7)",
        })

        tl.to(particles.material, { opacity: 0, duration: 0.1 }, "-=0.1")
        tl.to(stairMesh.material, { opacity: 0.9, duration: 0.3 }, "-=0.1")

        tl.from(stairMesh.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.4, ease: "elastic.out(1, 0.3)" }, "<")

        tl.to([leftRail.scale, rightRail.scale], { x: 1, y: 1, z: 1, duration: 0.4 }, "-=0.2")

        this.moveCameraUp(index)
      }

      moveCameraUp(stepIndex: number) {
        const gsap = (window as any).gsap

        const targetY = 2 + stepIndex * 1.5
        const targetZ = 10 - stepIndex * 2

        gsap.to(this.camera.position, {
          y: targetY,
          z: targetZ,
          duration: 1.2,
          ease: "power2.inOut",
          onUpdate: () => {
            this.camera.lookAt(0, targetY - 1, targetZ - 8)
          },
        })

        gsap.to(this.pointLight.position, {
          y: targetY + 2,
          z: targetZ - 5,
          duration: 1,
        })
      }

      handleYes() {
        if (this.isAnimating) return
        this.isAnimating = true

        const gsap = (window as any).gsap

        this.createStair(this.stepIndex + 1)
        this.stepIndex++

        const qBox = document.getElementById("question-box")

        gsap.to(qBox, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            if (this.stepIndex >= this.totalSteps) {
              this.showFinalCelebration()
            } else {
              const qText = document.getElementById("q-text")
              if (qText) qText.innerText = this.questions[this.stepIndex]

              const pct = Math.round((this.stepIndex / this.totalSteps) * 100)
              const progressText = document.getElementById("progress-text")
              if (progressText) progressText.innerText = `${pct}% Complete`

              gsap.set(qBox, { y: 30 })
              gsap.to(qBox, { opacity: 1, y: 0, duration: 0.3 })

              const btnNo = document.getElementById("btn-no")
              const currentScale = 1 - this.stepIndex * 0.15
              gsap.to(btnNo, { scale: currentScale, opacity: currentScale, duration: 0.3 })
            }
            this.isAnimating = false
          },
        })
      }

      handleNo() {
        if (this.isAnimating) return

        const gsap = (window as any).gsap
        const btnNo = document.getElementById("btn-no")
        const qText = document.getElementById("q-text")
        if (!qText) return

        const originalText = qText.innerText

        gsap.to(this.camera.position, {
          x: "+=0.2",
          y: "+=0.1",
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "rough",
          onComplete: () => {
            gsap.to(this.camera.position, { x: 0, duration: 0.2 })
          },
        })

        gsap.to(qText, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            qText.innerText = "Most successful brands said yes..."
            qText.style.color = "#ff4444"
            gsap.to(qText, { opacity: 1, duration: 0.2 })
          },
        })

        setTimeout(() => {
          gsap.to(qText, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              qText.innerText = originalText
              qText.style.color = ""
              gsap.to(qText, { opacity: 1, duration: 0.2 })
            },
          })

          const btnYes = document.getElementById("btn-yes")
          gsap.fromTo(btnYes, { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 3 })
        }, 2000)
      }

      showFinalCelebration() {
        const gsap = (window as any).gsap
        const THREE = (window as any).THREE

        const qBox = document.getElementById("question-box")
        const cta = document.getElementById("final-cta")

        if (qBox) qBox.style.display = "none"
        if (cta) {
          cta.style.display = "flex"
          gsap.to(cta, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 })
        }

        const platformGeo = new THREE.CylinderGeometry(6, 6, 0.5, 32)
        const platformMat = new THREE.MeshPhysicalMaterial({
          color: 0xffd700,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x332200,
        })
        const platform = new THREE.Mesh(platformGeo, platformMat)

        platform.position.set(0, this.stepIndex * 1.5, -(this.stepIndex * 2) - 2)
        platform.scale.set(0, 0, 0)
        this.scene.add(platform)

        gsap.to(platform.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "elastic.out(1, 0.5)" })

        this.spawnConfetti(platform.position)
      }

      spawnConfetti(position: any) {
        const THREE = (window as any).THREE

        const particleCount = 1000
        const geometry = new THREE.BufferGeometry()
        const positions = []
        const colors = []

        const colorList = [
          new THREE.Color(0xff0000),
          new THREE.Color(0x00ff00),
          new THREE.Color(0x0000ff),
          new THREE.Color(0xffd700),
        ]

        for (let i = 0; i < particleCount; i++) {
          positions.push(position.x, position.y + 2, position.z)
          const color = colorList[Math.floor(Math.random() * colorList.length)]
          colors.push(color.r, color.g, color.b)
        }

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

        const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true })
        const confetti = new THREE.Points(geometry, material)
        this.scene.add(confetti)

        const velocities = []
        for (let i = 0; i < particleCount; i++) {
          velocities.push({
            x: (Math.random() - 0.5) * 0.5,
            y: Math.random() * 0.5 + 0.2,
            z: (Math.random() - 0.5) * 0.5,
          })
        }

        const animateConfetti = () => {
          const posAttribute = confetti.geometry.attributes.position
          for (let i = 0; i < particleCount; i++) {
            velocities[i].y -= 0.01

            posAttribute.setX(i, posAttribute.getX(i) + velocities[i].x)
            posAttribute.setY(i, posAttribute.getY(i) + velocities[i].y)
            posAttribute.setZ(i, posAttribute.getZ(i) + velocities[i].z)
          }
          posAttribute.needsUpdate = true
          requestAnimationFrame(animateConfetti)
        }
        animateConfetti()
      }

      addEventListeners() {
        const handleResize = () => {
          this.camera.aspect = window.innerWidth / window.innerHeight
          this.camera.updateProjectionMatrix()
          this.renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener("resize", handleResize)

        const btnYes = document.getElementById("btn-yes")
        const btnNo = document.getElementById("btn-no")

        if (btnYes) btnYes.addEventListener("click", () => this.handleYes())
        if (btnNo) btnNo.addEventListener("click", () => this.handleNo())
      }

      render() {
        requestAnimationFrame(() => this.render())

        this.scene.children.forEach((child: any) => {
          if (child.type === "Points") {
            child.rotation.y += 0.001
          }
        })

        this.renderer.render(this.scene, this.camera)
      }
    }

    new YesLadderClass(canvasContainerRef.current!)
  }

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />

      <section className="yes-ladder-section relative min-h-screen">
        <div id="canvas-container" ref={canvasContainerRef} className="absolute inset-0 z-[1]" style={{
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)'
        }} />

        <div id="ui-layer" className="absolute inset-0 z-[2] flex flex-col justify-center items-center pointer-events-none">
          <div className="top-hud absolute top-5 flex justify-between w-[90%] max-w-[1200px] text-sm text-white/60">
            <div className="social-proof bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              👁 1,247 brands climbing today
            </div>
            <div className="progress" id="progress-text">
              0% Complete
            </div>
          </div>

          <div className="interaction-box text-center pointer-events-auto" id="question-box">
            <div
              className="question-text text-5xl md:text-6xl font-bold mb-10 tracking-tight"
              id="q-text"
              style={{
                textShadow: "0 0 20px rgba(0,0,0,0.5)",
                background: "linear-gradient(to bottom, #ffffff, #a5a5a5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Want more clients?
            </div>
            <div className="btn-container flex gap-8 justify-center items-center flex-col sm:flex-row">
              <button
                className="btn-yes relative overflow-hidden bg-gradient-to-br from-[#00ff88] to-[#00cc6a] border-none px-16 py-5 text-2xl font-bold text-[#00331a] rounded-full cursor-pointer transition-all duration-300 hover:scale-110"
                id="btn-yes"
                style={{
                  boxShadow: "0 0 20px rgba(0, 255, 136, 0.4)",
                }}
              >
                YES
              </button>
              <button
                className="btn-no bg-transparent border border-[#444] text-[#888] px-8 py-3 text-base rounded-full cursor-pointer transition-all duration-300 hover:border-[#666] hover:text-[#aaa]"
                id="btn-no"
              >
                not really
              </button>
            </div>
          </div>

          <div id="final-cta" className="hidden flex-col items-center pointer-events-auto opacity-0">
            <h1 className="question-text text-5xl md:text-6xl font-bold mb-6 text-[#ffd700]">
              You&apos;ve reached the top!
            </h1>
            <button className="golden-btn bg-gradient-to-br from-[#ffd700] to-[#ffa500] text-[#3e1f00] px-20 py-6 text-3xl border-none rounded-lg font-black cursor-pointer uppercase"
              style={{
                boxShadow: "0 0 50px rgba(255, 215, 0, 0.5)",
              }}
            >
              Claim Strategy Session &rarr;
            </button>
            <p className="mt-5 text-[#aaa]">Locked in December Pricing</p>
          </div>
        </div>

        <style jsx>{`
          .btn-yes::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(255,255,255,0.2);
            transform: rotate(45deg) translate(-100%, -100%);
            animation: shine 3s infinite;
          }

          @keyframes shine {
            0% { transform: rotate(45deg) translate(-100%, -100%); }
            20% { transform: rotate(45deg) translate(100%, 100%); }
            100% { transform: rotate(45deg) translate(100%, 100%); }
          }

          @media (max-width: 768px) {
            .question-text { font-size: 2rem; }
            .btn-yes { padding: 15px 40px; font-size: 1.2rem; }
          }
        `}</style>
      </section>
    </>
  )
}
