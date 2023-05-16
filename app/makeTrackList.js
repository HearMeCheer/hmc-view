/**
 * Omits specified keys from a dict
 * @param dict {Object}
 * @param keys {string[]}
 * @return {Object}
 */
function omit(dict, keys) {
    const copy = { ...dict };
    for (const key of keys) {
        delete copy[key];
    }
    return copy;
}

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
