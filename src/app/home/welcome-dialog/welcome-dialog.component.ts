import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { FormControl } from '@angular/forms';
import { WebSocketService } from 'src/app/core/service/web-socket.service';
import {
    WebSocketOutgoingEvent,
    WebSocketIncomingEvent,
} from 'src/app/core/models/web-socket.model';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Player } from 'src/app/core/models/player.model';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
    selector: 'app-welcome-dialog',
    templateUrl: './welcome-dialog.component.html',
    styleUrls: ['./welcome-dialog.component.scss'],
})
export class WelcomeDialogComponent implements OnInit {
    @Input() edit = false;
    @Input() player: Player = undefined;
    @Input() remember: boolean = false;

    nicknameInput: FormControl;
    avatarInput: FormControl;
    rememberInput: FormControl;

    nicknameError$ = new BehaviorSubject<string>(undefined);

    avatars = [
        'https://i.pinimg.com/originals/fa/0c/05/fa0c05778206cb2b2dddf89267b7a31c.jpg',
        'https://i.imgur.com/gxl4zj9.jpg',
        'https://media1.tenor.com/images/ff5f832e40cf3ec7787d1c539bf02ce7/tenor.gif?itemid=7939264',
        'https://vignette.wikia.nocookie.net/surrealmemes/images/0/09/Meme_Man_HD.png/revision/latest?cb=20190103112747',
        'https://i.kym-cdn.com/photos/images/newsfeed/000/925/494/218.png_large',
        'https://i.imgur.com/sYDqBU1.jpg',
        'http://cdn130.picsart.com/255534241018212.png',
        'https://vignette.wikia.nocookie.net/meme/images/4/42/1385136139955.png/revision/latest?cb=20150207013804',
        'https://i.kym-cdn.com/photos/images/newsfeed/001/535/447/f3f.jpg',
        'https://upload.wikimedia.org/wikipedia/en/f/f9/Dat_Boi_%28resized_50%25%29.jpg',
        'https://i.pinimg.com/originals/87/f5/aa/87f5aaa2fe343cebac0df3b5031f16ed.gif',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-u1WHqURBNarCxD-qi9A9ITBOI1xy2wjcMSLowYQYUOpwwipQ',
        'https://ih0.redbubble.net/image.342880217.9061/ap,550x550,16x12,1,transparent,t.u7.png',
        'https://i.kym-cdn.com/photos/images/newsfeed/001/469/824/de5.jpg',
        'http://p16-tiktokcdn-com.akamaized.net/aweme/1080x1080/tiktok-obj/1617428033719297.webp',
        'http://giphygifs.s3.amazonaws.com/media/2pqvP0X0EauDC/giphy.gif',
        'https://vignette.wikia.nocookie.net/surrealmemes/images/8/87/Meme_Man_Front-0.png',
        'https://i.kym-cdn.com/news/images/desktop/000/000/157/cca.png',
        'https://pm1.narvii.com/7262/b3f2f5a56f2ae066fb0fe8fd3a459344faf3662ar1-1080-1076v2_00.jpg',
    ];

    constructor(
        private modal: NzModalRef,
        private socket: WebSocketService,
        private auth: AuthService,
    ) {}

    ngOnInit() {
        this.nicknameInput = new FormControl(
            (this.player && this.player.name) || '',
        );
        this.avatarInput = new FormControl(
            (this.player && this.player.avatar) || '',
        );
        this.rememberInput = new FormControl(this.remember);
    }

    destroyModal(): void {
        this.modal.destroy({ data: 'this the result data' });
    }

    submitUser() {
        this.nicknameError$.next(undefined);
        if (this.nicknameInput.value) {
            const player: Partial<Player> = {
                name: this.nicknameInput.value,
                avatar: this.avatarInput.value,
            };
            this.socket.emit({
                event: this.edit
                    ? WebSocketOutgoingEvent.edit
                    : WebSocketOutgoingEvent.join,
                data: player,
            });
            this.socket
                .listenFor<Player>(WebSocketIncomingEvent.playerInfo)
                .pipe(take(1))
                .subscribe(data => {
                    this.destroyModal();
                    this.auth.remember$.next(this.rememberInput.value);
                });
        } else {
            this.nicknameError$.next('Please enter nickname');
        }
    }
}