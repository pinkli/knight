class Tree extends Obstacle {

    constructor() {
        super();

        this.trunkWidth = this.rng.next(10, 20);
        this.trunkHeight = this.rng.next(100, 250);

        this.radius = 20;
        this.alpha = 1;
        
        this.renderPadding = this.trunkHeight + 60;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (!this.noRegen) regenEntity(this, CANVAS_WIDTH / 2 + 200);

        this.rng.reset();

        let targetAlpha = 1;
        for (const character of this.scene.category('player')) {
            if (
                isBetween(this.x - 100, character.x, this.x + 100) &&
                isBetween(this.y - this.trunkHeight - 50, character.y, this.y)
            ) {
                targetAlpha = 0.2;
                break;
            }
        }

        this.alpha += between(-elapsed * 2, targetAlpha - this.alpha, elapsed * 2);
    }

    doRender() {
        translate(this.x, this.y);
        
        withShadow(() => {
            this.rng.reset();

            wrap(() => {
                rotate(sin((this.age + this.rng.next(0, 10)) * TWO_PI / this.rng.next(4, 16)) * this.rng.next(PI / 32, PI / 64));
                fillStyle = ctx.resolveColor('#a65');

                if (!ctx.isShadow) {
                    globalAlpha = this.alpha;
                }

                if (!ctx.isShadow) fillRect(-this.trunkWidth / 2, 0, this.trunkWidth, -this.trunkHeight);

                translate(0, -this.trunkHeight);

                beginPath();
                fillStyle = ctx.resolveColor('#060');

                for (let i = 0 ; i < 5 ; i++) {
                    const angle = i / 5 * TWO_PI;
                    const dist = this.rng.next(20, 50);
                    const x =  cos(angle) * dist;
                    const y = sin(angle) * dist * 0.5;
                    const radius = this.rng.next(20, 40);

                    wrap(() => {
                        translate(x, y);
                        rotate(PI / 4);
                        rotate(sin((this.age + this.rng.next(0, 10)) * TWO_PI / this.rng.next(2, 8)) * PI / 32);
                        rect(-radius, -radius, radius * 2, radius * 2);
                    });
                }

                if (ctx.isShadow) rect(0, 0, this.trunkWidth, this.trunkHeight);

                fill();
            });

            clip();

            if (!ctx.isShadow) {
                for (const character of this.scene.category('enemy')) {
                    if (
                        isBetween(this.x - 100, character.x, this.x + 100) &&
                        isBetween(this.y - this.trunkHeight - 50, character.y, this.y)
                    ) {
                        ctx.resolveColor = () => character instanceof Player ? '#888' : '#400';
                        wrap(() => {
                            translate(character.x - this.x, character.y - this.y);
                            scale(character.facing, 1);
                            globalAlpha = this.alpha;
                            character.renderBody();
                        });
                    }
                }
            }
        });
    }
}
