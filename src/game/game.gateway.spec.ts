import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { PlayerModule } from '../player/player.module';

describe('Game Gateway', () => {
    let gateway: GameGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PlayerModule],
            providers: [GameGateway],
        }).compile();

        gateway = module.get<GameGateway>(GameGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});