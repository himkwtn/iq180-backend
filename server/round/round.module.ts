import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { EventModule } from '../event/event.module';
import { StoreModule } from '../store/store.module';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';

@Module({
    imports: [EventModule, StoreModule, GameModule, PlayerModule],
    providers: [RoundService],
})
export class RoundModule {}
