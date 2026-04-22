import { GameObjects, Scene, Math as PhaserMath } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Graphics;
    clouds: GameObjects.Container;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Create gradient sky background
        this.background = this.make.graphics({ x: 0, y: 0 } as any);
        this.createSkyGradient();
        this.background.setDepth(0);

        // Create parallax clouds
        this.clouds = this.add.container(0, 0).setDepth(10);
        this.createParallaxClouds();

        // Add title text
        this.title = this.add.text(512, 150, 'Game Title', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#1a3a52', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Add logo with gentle bobbing animation
        this.logo = this.add.image(512, 350, 'logo').setDepth(100);
        this.animateLogo();

        // Add start instruction
        const startText = this.add.text(512, 550, 'Click or Press SPACE to Start', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#1a3a52', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Blinking animation for start text
        this.tweens.add({
            targets: startText,
            alpha: { value: 0.3, duration: 800 },
            yoyo: true,
            repeat: -1
        });

        // Add Shoot'em Up button
        const shootemUpButton = this.add.text(512, 620, 'Shoot\'em Up', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#1a3a52', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        // Button hover effect
        shootemUpButton.on('pointerover', () => {
            shootemUpButton.setScale(1.1);
            shootemUpButton.setColor('#ffff00');
        });

        shootemUpButton.on('pointerout', () => {
            shootemUpButton.setScale(1);
            shootemUpButton.setColor('#ffffff');
        });

        shootemUpButton.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation(); // Prevent the click from reaching the scene's general handler
            
            // Stop logo animation before transitioning (consistency with changeScene)
            if (this.logoTween)
            {
                this.logoTween.stop();
                this.logoTween = null;
            }
            
            this.scene.start('ShootemUp');
        });

        // Setup input
        this.input.on('pointerdown', () => this.changeScene());
        this.input.keyboard?.on('keydown-SPACE', () => this.changeScene());

        EventBus.emit('current-scene-ready', this);
    }

    private createSkyGradient ()
    {
        const width = this.sys.game.canvas.width;

        // Create gradient from light blue (top) to lighter blue (bottom)
        this.background.clear();
        this.background.fillStyle(0x87CEEB, 1); // Top: Light blue
        this.background.fillRect(0, 0, width, this.sys.game.canvas.height * 0.6);
        
        this.background.fillStyle(0xB0E0E6, 1); // Bottom: Powder blue
        this.background.fillRect(0, this.sys.game.canvas.height * 0.6, width, this.sys.game.canvas.height * 0.4);
    }

    private createParallaxClouds ()
    {
        const width = this.sys.game.canvas.width;

        // Create 3 layers of clouds at different speeds
        const cloudLayers = [
            { y: 100, scale: 0.6, speed: 0.3, count: 3 },
            { y: 180, scale: 0.8, speed: 0.5, count: 2 },
            { y: 280, scale: 1.0, speed: 0.7, count: 2 }
        ];

        cloudLayers.forEach((layer) => {
            for (let i = 0; i < layer.count; i++)
            {
                const x = (width / layer.count) * i + PhaserMath.Between(-50, 50);
                const cloud = this.createCloud(x, layer.y, layer.scale);
                this.clouds.add(cloud);

                // Animate cloud scrolling
                this.tweens.add({
                    targets: cloud,
                    x: { value: x - width * 0.8, duration: 20000 / layer.speed, ease: 'none' },
                    yoyo: false,
                    repeat: -1,
                    hold: 0
                });
            }
        });
    }

    private createCloud (x: number, y: number, scale: number): GameObjects.Graphics
    {
        const cloud = this.make.graphics({ x, y } as any);
        cloud.setScale(scale);
        cloud.fillStyle(0xFFFFFF, 0.85);

        // Draw fluffy cloud shapes
        const radius = 15;
        cloud.fillCircle(0, 0, radius);
        cloud.fillCircle(radius * 0.8, -radius * 0.5, radius * 0.9);
        cloud.fillCircle(radius * 1.6, 0, radius * 0.8);
        cloud.fillCircle(radius * 2.4, -radius * 0.5, radius * 0.9);
        cloud.fillCircle(radius * 3.2, 0, radius);

        return cloud;
    }

    private animateLogo ()
    {
        this.logoTween = this.tweens.add({
            targets: this.logo,
            y: { value: 340, duration: 2000, ease: 'Sine.inOut' },
            yoyo: true,
            repeat: -1
        });
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        }
        
        if (vueCallback)
        {
            vueCallback({
                x: Math.floor(this.logo.x),
                y: Math.floor(this.logo.y)
            });
        }
    }
}
