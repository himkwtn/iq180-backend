import { Component, OnInit } from '@angular/core';
import {
    OperatorCard,
    DraggableCard,
    NumberCard,
    CardType,
} from 'src/app/core/models/game/card.model';
import { BehaviorSubject, Observable, empty, interval, of } from 'rxjs';
import {
    transferArrayItem,
    moveItemInArray,
    CdkDragDrop,
    CdkDrag,
    CdkDropList,
    CdkDragEnd,
} from '@angular/cdk/drag-drop';
import {
    startWith,
    delay,
    switchMap,
    tap,
    take,
    map,
    endWith,
} from 'rxjs/operators';

@Component({
    selector: 'app-game-field',
    templateUrl: './game-field.component.html',
    styleUrls: ['./game-field.component.scss'],
})
export class GameFieldComponent implements OnInit {
    numbers$ = new BehaviorSubject<NumberCard[]>([]);
    answer$ = new BehaviorSubject<DraggableCard[]>([]);
    operators: OperatorCard[] = [
        { operator: '+', display: '+', disabled: false },
        { operator: '-', display: '-', disabled: false },
        { operator: 'x', display: 'x', disabled: false },
        { operator: '÷', display: '÷', disabled: false },
    ].map(e => ({ ...e, type: CardType.operator }));
    operators$ = this.answer$.pipe(
        map(ans => ans.filter(e => e.type === CardType.operator)),
    );

    timer$: Observable<number>;
    gaming$ = new BehaviorSubject<boolean>(false);

    constructor() {}

    ngOnInit() {
        this.reset();
        this.startGame();
    }

    createTimer(startTime: Date) {
        const delayMS = startTime.valueOf() - new Date().valueOf();
        this.timer$ = of(new Date()).pipe(
            delay(delayMS),
            switchMap(() => interval(1000)),
            take(61),
            map(t => 60 - t),
        );
    }
    /* Drag and Drop Stuff */
    startGame() {
        const future = new Date().valueOf() + 2000;
        this.createTimer(new Date(future));
        this.timer$.subscribe(
            time => {
                this.gaming$.next(true);
            },
            () => null,
            () => {
                this.gaming$.next(false);
            },
        );
    }

    reset() {
        this.operators = [
            { operator: '+', display: '+', disabled: false },
            { operator: '-', display: '-', disabled: false },
            { operator: 'x', display: 'x', disabled: false },
            { operator: '÷', display: '÷', disabled: false },
        ].map(e => ({ ...e, type: CardType.operator }));
        this.numbers$.next(
            [
                { value: 1, display: '1', disabled: false },
                { value: 2, display: '2', disabled: false },
                { value: 3, display: '3', disabled: false },
                { value: 4, display: '4', disabled: false },
                { value: 5, display: '5', disabled: false },
            ].map(e => ({ ...e, type: CardType.number })),
        );
        this.answer$.next([]);
    }
    dropAnswer(event: CdkDragDrop<DraggableCard[]>) {
        if (event.previousContainer === event.container) {
            const arr = this.answer$.getValue();
            moveItemInArray(arr, event.previousIndex, event.currentIndex);
            this.answer$.next(arr);
        } else {
            const card = event.previousContainer.data[event.previousIndex];
            if (card.type === CardType.number) {
                this.addNumber(
                    card as NumberCard,
                    event.previousIndex,
                    event.currentIndex,
                );
            } else if (card.type === CardType.operator) {
                this.addOperator(
                    card as OperatorCard,
                    event.previousIndex,
                    event.currentIndex,
                );
            }
        }
    }

    dropNumber(event: CdkDragDrop<DraggableCard[]>) {
        if (event.previousContainer === event.container) {
            const arr = this.numbers$.getValue();
            moveItemInArray(arr, event.previousIndex, event.currentIndex);
            this.numbers$.next(arr);
        } else {
            const card = event.previousContainer.data[event.previousIndex];
            if (card.type === CardType.number) {
                this.removeNumber(event.previousIndex, event.currentIndex);
            }
        }
    }

    dropOperator(event: CdkDragDrop<DraggableCard[]>) {
        if (event.previousContainer === event.container) {
            const arr = this.operators;
            moveItemInArray(arr, event.previousIndex, event.currentIndex);
        } else {
            const card = event.previousContainer.data[event.previousIndex];
            if (card.type === CardType.operator) {
                const ansArr = this.answer$.getValue();
                ansArr.splice(event.previousIndex, 1);
                this.answer$.next(ansArr);
            }
        }
    }

    removeNumber(fromIdx: number, toIdx?: number) {
        const ans = this.answer$.getValue();
        const dst = this.numbers$.getValue();
        transferArrayItem(ans, dst, fromIdx, toIdx || dst.length);
        this.numbers$.next(dst);
        this.answer$.next(ans);
    }

    removeOperator(card: OperatorCard, idx: number) {
        const ansArr = this.answer$.getValue();
        ansArr.splice(idx, 1);
        this.answer$.next(ansArr);
    }

    removeCard(card: DraggableCard, idx: number) {
        if (card.type === CardType.number) {
            this.removeNumber(idx);
        } else {
            this.removeOperator(card as OperatorCard, idx);
        }
    }

    addNumber(card: NumberCard, numIdx: number, ansIdx?: number) {
        const ansArr = this.answer$.getValue();
        ansArr.splice(ansIdx !== undefined ? ansIdx : ansArr.length, 0, card);
        this.answer$.next(ansArr);
        const numArr = this.numbers$.getValue();
        numArr.splice(numIdx, 1);
        this.numbers$.next(numArr);
    }

    addOperator(card: OperatorCard, opIdx: number, ansIdx?: number) {
        const ansArr = this.answer$.getValue();
        if (ansArr.filter(e => e.type === CardType.operator).length < 4) {
            ansArr.splice(
                ansIdx !== undefined ? ansIdx : ansArr.length,
                0,
                card,
            );
            this.answer$.next(ansArr);
        }
    }

    onDragEnded(event: CdkDragEnd) {
        console.log(event);
        event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
        const source: any = event.source;
        source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
    }

    isNumber(item: CdkDrag<DraggableCard>) {
        return item.data.type === CardType.number;
    }

    isOperator(item: CdkDrag<DraggableCard>) {
        return item.data.type === CardType.operator;
    }
}