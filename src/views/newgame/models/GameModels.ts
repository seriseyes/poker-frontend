export interface TableModel {
    _id: string;
    big: number;
    small: number;
    status: string;
}

export interface RoomModel {
    _id: string;
    players: [{
        player: PlayerModel;
        fold: boolean;
        action: string;
        big: boolean;
        small: boolean;
        status: string;
        order: number;
    }];
    table: TableModel;
    call: number;
    pot: number;
    cards: string[];
    current: string;
    winner: string;
    started: boolean;
}

export interface PlayerModel {
    _id: string;
    order: number;
    username: string;
    chips: number;
    fold: boolean;
    action: string;
    roomId: string;
    status: string;
    turn: boolean;
    big: boolean;
    small: boolean;
}

export interface ActionModel {
    room: RoomModel;
    token: string;
    socket: any;
    player: PlayerModel;
}
