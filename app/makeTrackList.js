import { omit } from '@hearmecheer/shared/Dict';

const makeTrackList = (schema) => ({
    _keyList: {},
    _list: [],

    add(track) {
        this._keyList = { ...this._keyList, [track.id]: track };
        this._list = [...this._list, track];
        this.onChange(this.list());
    },

    get(track) {
        return this._keyList[track.id];
    },

    list() {
        return [...this._list];
    },

    remove(track) {
        this._keyList = omit(this._keyList, [track.id]);
        this._list = this._list.filter((t) => t.id !== track.id);
        this.onChange(this.list());
    },

    // override methods
    onChange: () => null,

    clear() {
        this._keyList = {};
        this._list = [];
    },

    ...schema,
});

export default makeTrackList;
