import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// Game constants
const PLAYER_SPEED = 300;
const BULLET_SPEED = 500;
const ENEMY_SPEED = 150;
const FIRE_COOLDOWN = 250; // milliseconds
const ENEMY_SPAWN_RATE = 2000; // milliseconds
const INITIAL_HEALTH = 3;
const INVINCIBILITY_DURATION = 1000; // milliseconds
const COLLISION_DISTANCE_BULLET = 25;
const COLLISION_DISTANCE_PLAYER = 30;

interface Bullet {
    sprite: Phaser.GameObjects.Graphics;
    active: boolean;
}

interface Enemy {
    sprite: Phaser.GameObjects.Graphics;
    active: boolean;
}

export class ShootemUp extends Scene
{
    private player!: Phaser.GameObjects.Graphics;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasdKeys!: {
        w: Phaser.Input.Keyboard.Key;
        a: Phaser.Input.Keyboard.Key;
        s: Phaser.Input.Keyboard.Key;
        d: Phaser.Input.Keyboard.Key;
    };
    private spaceKey!: Phaser.Input.Keyboard.Key;
    
    private bullets: Bullet[] = [];
    private enemies: Enemy[] = [];
    
    private score: number = 0;
    private health: number = INITIAL_HEALTH;
    
    private scoreText!: Phaser.GameObjects.Text;
    private healthText!: Phaser.GameObjects.Text;
    
    private lastShotTime: number = 0;
    private enemySpawnTimer!: Phaser.Time.TimerEvent;
    
    private isInvincible: boolean = false;
    private invincibilityTimer?: Phaser.Time.TimerEvent;

    constructor ()
    {
        super('ShootemUp');
    }

    create ()
    {
        // Create player ship (blue triangle pointing right)
        this.player = this.add.graphics();
        this.player.fillStyle(0x0000ff, 1);
        this.player.fillTriangle(0, -15, 0, 15, 30, 0);
        this.player.setPosition(100, 384);

        // Setup keyboard input
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasdKeys = {
            w: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Create UI text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.healthText = this.add.text(16, 48, `Health: ${INITIAL_HEALTH}`, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        // Spawn enemies
        this.enemySpawnTimer = this.time.addEvent({
            delay: ENEMY_SPAWN_RATE,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        EventBus.emit('current-scene-ready', this);
    }

    update (time: number, delta: number)
    {
        if (this.health <= 0)
        {
            return;
        }

        // Player movement
        this.handlePlayerMovement(delta);

        // Shooting
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey))
        {
            this.shoot(time);
        }

        // Update bullets
        this.updateBullets(delta);

        // Update enemies
        this.updateEnemies(delta);

        // Check collisions
        this.checkCollisions();
    }

    private handlePlayerMovement (delta: number): void
    {
        const moveDistance = (PLAYER_SPEED * delta) / 1000;

        let dx = 0;
        let dy = 0;

        // Check arrow keys and WASD
        if (this.cursors.left.isDown || this.wasdKeys.a.isDown)
        {
            dx = -moveDistance;
        }
        else if (this.cursors.right.isDown || this.wasdKeys.d.isDown)
        {
            dx = moveDistance;
        }

        if (this.cursors.up.isDown || this.wasdKeys.w.isDown)
        {
            dy = -moveDistance;
        }
        else if (this.cursors.down.isDown || this.wasdKeys.s.isDown)
        {
            dy = moveDistance;
        }

        // Move player
        this.player.x += dx;
        this.player.y += dy;

        // Constrain to screen bounds
        this.player.x = Phaser.Math.Clamp(this.player.x, 30, this.scale.width - 30);
        this.player.y = Phaser.Math.Clamp(this.player.y, 30, this.scale.height - 30);
    }

    private shoot (time: number): void
    {
        if (time - this.lastShotTime < FIRE_COOLDOWN)
        {
            return;
        }

        this.lastShotTime = time;

        // Create bullet (yellow rectangle)
        const bullet = this.add.graphics();
        bullet.fillStyle(0xffff00, 1);
        bullet.fillRect(0, -2, 10, 4);
        bullet.setPosition(this.player.x + 30, this.player.y);

        this.bullets.push({
            sprite: bullet,
            active: true
        });
    }

    private updateBullets (delta: number): void
    {
        const moveDistance = (BULLET_SPEED * delta) / 1000;

        for (const bullet of this.bullets)
        {
            if (!bullet.active)
            {
                continue;
            }

            bullet.sprite.x += moveDistance;

            // Remove bullets that are off screen
            if (bullet.sprite.x > this.scale.width + 20)
            {
                bullet.active = false;
                bullet.sprite.destroy();
            }
        }

        // Clean up inactive bullets
        this.bullets = this.bullets.filter(b => b.active);
    }

    private spawnEnemy (): void
    {
        if (this.health <= 0)
        {
            return;
        }

        // Create enemy (red triangle pointing left)
        const enemy = this.add.graphics();
        enemy.fillStyle(0xff0000, 1);
        enemy.fillTriangle(0, -15, 0, 15, -30, 0);
        
        const y = Phaser.Math.Between(50, this.scale.height - 50);
        enemy.setPosition(this.scale.width + 30, y);

        this.enemies.push({
            sprite: enemy,
            active: true
        });
    }

    private updateEnemies (delta: number): void
    {
        const moveDistance = (ENEMY_SPEED * delta) / 1000;

        for (const enemy of this.enemies)
        {
            if (!enemy.active)
            {
                continue;
            }

            enemy.sprite.x -= moveDistance;

            // Check if enemy reached the left side
            if (enemy.sprite.x < -30)
            {
                enemy.active = false;
                enemy.sprite.destroy();
                this.takeDamage();
            }
        }

        // Clean up inactive enemies
        this.enemies = this.enemies.filter(e => e.active);
    }

    private checkCollisions (): void
    {
        // Check bullet-enemy collisions
        for (const bullet of this.bullets)
        {
            if (!bullet.active)
            {
                continue;
            }

            for (const enemy of this.enemies)
            {
                if (!enemy.active)
                {
                    continue;
                }

                // Simple distance-based collision
                const dx = bullet.sprite.x - enemy.sprite.x;
                const dy = bullet.sprite.y - enemy.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < COLLISION_DISTANCE_BULLET)
                {
                    // Hit!
                    bullet.active = false;
                    bullet.sprite.destroy();
                    
                    enemy.active = false;
                    enemy.sprite.destroy();
                    
                    this.score += 10;
                    this.updateScore();
                    
                    break;
                }
            }
        }

        // Check player-enemy collisions
        if (!this.isInvincible)
        {
            for (const enemy of this.enemies)
            {
                if (!enemy.active)
                {
                    continue;
                }

                const dx = this.player.x - enemy.sprite.x;
                const dy = this.player.y - enemy.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < COLLISION_DISTANCE_PLAYER)
                {
                    // Player hit by enemy!
                    enemy.active = false;
                    enemy.sprite.destroy();
                    this.takeDamage();
                    break;
                }
            }
        }
    }

    private updateScore (): void
    {
        this.scoreText.setText(`Score: ${this.score}`);
        EventBus.emit('shootemup-score-changed', this.score);
    }

    private updateHealth (): void
    {
        this.healthText.setText(`Health: ${this.health}`);
        EventBus.emit('shootemup-health-changed', this.health);
    }

    private takeDamage (): void
    {
        this.health--;
        this.updateHealth();

        if (this.health <= 0)
        {
            this.gameOver();
            return;
        }

        // Start invincibility period
        this.isInvincible = true;
        
        // Visual feedback: make player blink
        this.tweens.add({
            targets: this.player,
            alpha: { from: 0.3, to: 1 },
            duration: 100,
            yoyo: true,
            repeat: Math.floor(INVINCIBILITY_DURATION / 200)
        });

        // End invincibility after duration
        this.invincibilityTimer = this.time.delayedCall(INVINCIBILITY_DURATION, () => {
            this.isInvincible = false;
            this.player.alpha = 1;
        });
    }

    private gameOver (): void
    {
        // Stop enemy spawning
        if (this.enemySpawnTimer)
        {
            this.enemySpawnTimer.remove();
        }

        // Display game over message
        this.add.text(512, 384, 'GAME OVER', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 460, `Final Score: ${this.score}`, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Return to main menu after 3 seconds
        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenu');
        });
    }

    changeScene (): void
    {
        this.scene.start('MainMenu');
    }

    shutdown (): void
    {
        // Clean up timers
        if (this.enemySpawnTimer)
        {
            this.enemySpawnTimer.remove();
        }

        if (this.invincibilityTimer)
        {
            this.invincibilityTimer.remove();
        }

        // Clean up all game objects
        this.bullets.forEach(bullet => {
            if (bullet.sprite)
            {
                bullet.sprite.destroy();
            }
        });
        this.bullets = [];

        this.enemies.forEach(enemy => {
            if (enemy.sprite)
            {
                enemy.sprite.destroy();
            }
        });
        this.enemies = [];

        // Stop all tweens
        this.tweens.killAll();
    }
}
