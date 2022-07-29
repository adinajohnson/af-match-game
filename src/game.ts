import 'phaser';
import { GameScene } from "./gameScene";

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#007AC6',
    width: 800,
    height: 600,
    scene: GameScene,
    parent: 'game'
};

export class MatchingGame extends Phaser.Game {
    constructor(config: object) {
        super(config);
    }
}

window.onload = () => {
    var game = new MatchingGame(config);
};
