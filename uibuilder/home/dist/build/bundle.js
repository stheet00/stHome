
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function set_custom_element_data_map(node, data_map) {
        Object.keys(data_map).forEach((key) => {
            set_custom_element_data(node, key, data_map[key]);
        });
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately before the component is updated after any state change.
     *
     * The first time the callback runs will be before the initial `onMount`
     *
     * https://svelte.dev/docs#run-time-svelte-beforeupdate
     */
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    /** regex of all html void element names */
    const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
    function is_void(name) {
        return void_element_names.test(name) || name.toLowerCase() === '!doctype';
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function validate_dynamic_element(tag) {
        const is_string = typeof tag === 'string';
        if (tag && !is_string) {
            throw new Error('<svelte:element> expects "this" attribute to be a string.');
        }
    }
    function validate_void_dynamic_element(tag) {
        if (tag && is_void(tag)) {
            console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules/@svelteuidev/core/internal/errors/Error.svelte generated by Svelte v3.55.1 */

    const { Error: Error_1$3 } = globals;

    // (7:0) {#if observable}
    function create_if_block$6(ctx) {
    	let html_tag;
    	let raw_value = exception(/*component*/ ctx[1], /*code*/ ctx[2]) + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*component, code*/ 6 && raw_value !== (raw_value = exception(/*component*/ ctx[1], /*code*/ ctx[2]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(7:0) {#if observable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let if_block_anchor;
    	let if_block = /*observable*/ ctx[0] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$3("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*observable*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Error', slots, []);
    	let { observable = false } = $$props;
    	let { component } = $$props;
    	let { code } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (component === undefined && !('component' in $$props || $$self.$$.bound[$$self.$$.props['component']])) {
    			console.warn("<Error> was created without expected prop 'component'");
    		}

    		if (code === undefined && !('code' in $$props || $$self.$$.bound[$$self.$$.props['code']])) {
    			console.warn("<Error> was created without expected prop 'code'");
    		}
    	});

    	const writable_props = ['observable', 'component', 'code'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Error> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('observable' in $$props) $$invalidate(0, observable = $$props.observable);
    		if ('component' in $$props) $$invalidate(1, component = $$props.component);
    		if ('code' in $$props) $$invalidate(2, code = $$props.code);
    	};

    	$$self.$capture_state = () => ({ exception, observable, component, code });

    	$$self.$inject_state = $$props => {
    		if ('observable' in $$props) $$invalidate(0, observable = $$props.observable);
    		if ('component' in $$props) $$invalidate(1, component = $$props.component);
    		if ('code' in $$props) $$invalidate(2, code = $$props.code);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [observable, component, code];
    }

    class Error$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$r, safe_not_equal, { observable: 0, component: 1, code: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Error",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get observable() {
    		throw new Error_1$3("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set observable(value) {
    		throw new Error_1$3("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error_1$3("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error_1$3("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get code() {
    		throw new Error_1$3("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error_1$3("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Error$2 = Error$1;

    const isBrowser = () => typeof window !== 'undefined';
    /** Determines whether the app is running in the browser or on the server. */
    const browser = isBrowser();

    const minifiedCss = '.modal-header{padding: 2px 16px;background-color: #339af0;color: white;}.modal-body{padding: 2px 16px;}.modal-footer{padding: 2px 16px;background-color: #339af0;color: white;}.modal-content{position: relative;background-color: #fefefe;margin: auto;padding: 0;border: 1px solid #888;width: 80%;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);animation-name: animateTop;animation-duration: 0.4s;}@keyframes animateTop {from {top: -300px; opacity: 0}to {top: 0; opacity: 1}}';

    const style = browser ? document.createElement('style') : undefined;
    if (browser) {
        const s = style;
        s.textContent = minifiedCss;
        s.id = 'svelteui-inject';
    }
    /**
     * The UserException function is used to help consumers of the library better navigate through potential errors.
     *
     *
     * It **does not** throw any errors because crashing the user's application is undesirable
     *
     * @param component the component the error is bound to
     * @param message the error message for the consumer
     * @param solution the potential solution for the consumer
     */
    function UserException(component, message, solution) {
        if (browser)
            document.head.appendChild(style);
        const html = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>[${component} Component Error]:</h2>
            <h3>${message}</h3>
        </div>
        <div class="modal-body">
            <pre>
                ${solution ? solution : ''}
            </pre>
        </div>
        <div class="modal-footer">
            <h3>Fix the code to dismiss this error.</h3>
        </div>
    </div>        
    `;
        return html;
    }

    function exception(component, code) {
        const { message, solution } = code;
        if (solution) {
            return UserException(component, message, solution);
        }
        return UserException(component, message);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    // This file taken from rgossiaux/svelte-headlessui
    // Copyright 2020-present Hunter Perrin
    function useActions$1(node, actions) {
        const actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            }
        };
    }

    /* eslint-disable @typescript-eslint/no-empty-function */
    const MODIFIER_DIVIDER = '!';
    const modifierRegex = new RegExp(`^[^${MODIFIER_DIVIDER}]+(?:${MODIFIER_DIVIDER}(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$`);
    /** Function for forwarding DOM events to the component's declaration */
    function createEventForwarder(component, except = []) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        const events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            const eventType = fullEventType;
            let destructor = () => { };
            for (const exception of except) {
                if (typeof exception === 'string' && exception === eventType) {
                    // Bail out of the event forwarding and run the normal Svelte $on() code
                    const callbacks = component.$$.callbacks[eventType] || (component.$$.callbacks[eventType] = []);
                    callbacks.push(callback);
                    return () => {
                        const index = callbacks.indexOf(callback);
                        if (index !== -1)
                            callbacks.splice(index, 1);
                    };
                }
                if (typeof exception === 'object' && exception['name'] === eventType) {
                    const oldCallback = callback;
                    callback = (...props) => {
                        if (!(typeof exception === 'object' && exception['shouldExclude']())) {
                            oldCallback(...props);
                        }
                    };
                }
            }
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const modifierMatch = eventType.match(modifierRegex);
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(MODIFIER_DIVIDER);
                    eventType = parts[0];
                    const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (const entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                }
            };
        };
    }

    /** --------------------- */
    const key = {};
    function useSvelteUIThemeContext() {
        return getContext(key);
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const colorScheme = writable('light');

    /* eslint-disable @typescript-eslint/ban-ts-comment */
    function useSvelteUITheme() {
        let observer;
        colorScheme?.subscribe((mode) => {
            observer = mode;
        });
        const DEFAULT_THEME = {
            // @ts-ignore
            ...theme$1,
            colorNames: colorNameMap,
            colorScheme: observer,
            dark: dark?.selector,
            fn: {
                themeColor: fns.themeColor,
                size: fns.size,
                radius: fns.radius,
                rgba: fns.rgba,
                variant: fns.variant
            }
        };
        return DEFAULT_THEME;
    }

    /* node_modules/@svelteuidev/core/styles/theme/SvelteUIProvider/SvelteUIProvider.svelte generated by Svelte v3.55.1 */
    const file$i = "node_modules/@svelteuidev/core/styles/theme/SvelteUIProvider/SvelteUIProvider.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	let div_levels = [
    		{ id: "SVELTEUI_PROVIDER" },
    		{
    			class: div_class_value = /*cx*/ ctx[4](/*className*/ ctx[2], /*classes*/ ctx[3].root, /*currentTheme*/ ctx[6]())
    		},
    		/*$$restProps*/ ctx[7]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$i, 47, 0, 1943);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[19](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions$1.call(null, div, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[5].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ id: "SVELTEUI_PROVIDER" },
    				(!current || dirty & /*cx, className, classes*/ 28 && div_class_value !== (div_class_value = /*cx*/ ctx[4](/*className*/ ctx[2], /*classes*/ ctx[3].root, /*currentTheme*/ ctx[6]()))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[19](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let overrides;
    	let mergedTheme;
    	let cx;
    	let classes;

    	const omit_props_names = [
    		"use","class","element","theme","styles","defaultProps","themeObserver","withNormalizeCSS","withGlobalStyles","override","inherit"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $colorScheme;
    	validate_store(colorScheme, 'colorScheme');
    	component_subscribe($$self, colorScheme, $$value => $$invalidate(21, $colorScheme = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteUIProvider', slots, ['default']);
    	let { use = [], class: className = '', element = undefined, theme = useSvelteUITheme(), styles = {}, defaultProps = {}, themeObserver = 'light', withNormalizeCSS = false, withGlobalStyles = false, override = {}, inherit = false } = $$props;

    	beforeUpdate(() => {
    		const htmlClassList = document.documentElement.classList;
    		if ($colorScheme === 'dark') htmlClassList.add(dark.className);
    		if ($colorScheme === 'light') htmlClassList.remove(dark.className);
    	});

    	const ctx = useSvelteUIThemeContext();
    	const useStyles = createStyles(() => ({ root: {} }));
    	const forwardEvents = createEventForwarder(get_current_component());
    	const DEFAULT_THEME = useSvelteUITheme();

    	const currentTheme = () => {
    		if (themeObserver === null) return null;
    		return themeObserver === 'light' ? mergedTheme : dark;
    	};

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('theme' in $$new_props) $$invalidate(8, theme = $$new_props.theme);
    		if ('styles' in $$new_props) $$invalidate(9, styles = $$new_props.styles);
    		if ('defaultProps' in $$new_props) $$invalidate(10, defaultProps = $$new_props.defaultProps);
    		if ('themeObserver' in $$new_props) $$invalidate(11, themeObserver = $$new_props.themeObserver);
    		if ('withNormalizeCSS' in $$new_props) $$invalidate(12, withNormalizeCSS = $$new_props.withNormalizeCSS);
    		if ('withGlobalStyles' in $$new_props) $$invalidate(13, withGlobalStyles = $$new_props.withGlobalStyles);
    		if ('override' in $$new_props) $$invalidate(14, override = $$new_props.override);
    		if ('inherit' in $$new_props) $$invalidate(15, inherit = $$new_props.inherit);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		beforeUpdate,
    		get_current_component,
    		mergeTheme,
    		useSvelteUITheme,
    		colorScheme,
    		key,
    		useSvelteUIThemeContext,
    		createStyles,
    		dark,
    		NormalizeCSS,
    		SvelteUIGlobalCSS,
    		createEventForwarder,
    		useActions: useActions$1,
    		use,
    		className,
    		element,
    		theme,
    		styles,
    		defaultProps,
    		themeObserver,
    		withNormalizeCSS,
    		withGlobalStyles,
    		override,
    		inherit,
    		ctx,
    		useStyles,
    		forwardEvents,
    		DEFAULT_THEME,
    		currentTheme,
    		classes,
    		cx,
    		overrides,
    		mergedTheme,
    		$colorScheme
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('theme' in $$props) $$invalidate(8, theme = $$new_props.theme);
    		if ('styles' in $$props) $$invalidate(9, styles = $$new_props.styles);
    		if ('defaultProps' in $$props) $$invalidate(10, defaultProps = $$new_props.defaultProps);
    		if ('themeObserver' in $$props) $$invalidate(11, themeObserver = $$new_props.themeObserver);
    		if ('withNormalizeCSS' in $$props) $$invalidate(12, withNormalizeCSS = $$new_props.withNormalizeCSS);
    		if ('withGlobalStyles' in $$props) $$invalidate(13, withGlobalStyles = $$new_props.withGlobalStyles);
    		if ('override' in $$props) $$invalidate(14, override = $$new_props.override);
    		if ('inherit' in $$props) $$invalidate(15, inherit = $$new_props.inherit);
    		if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
    		if ('cx' in $$props) $$invalidate(4, cx = $$new_props.cx);
    		if ('overrides' in $$props) $$invalidate(16, overrides = $$new_props.overrides);
    		if ('mergedTheme' in $$props) mergedTheme = $$new_props.mergedTheme;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*withGlobalStyles*/ 8192) {
    			if (withGlobalStyles) SvelteUIGlobalCSS();
    		}

    		if ($$self.$$.dirty & /*withNormalizeCSS*/ 4096) {
    			if (withNormalizeCSS) NormalizeCSS();
    		}

    		if ($$self.$$.dirty & /*inherit, theme, styles, defaultProps*/ 34560) {
    			$$invalidate(16, overrides = {
    				themeOverride: inherit ? { ...ctx.theme, ...theme } : theme,
    				styles: inherit ? { ...ctx.styles, ...styles } : styles,
    				defaultProps: inherit
    				? { ...ctx.styles, ...defaultProps }
    				: defaultProps
    			});
    		}

    		if ($$self.$$.dirty & /*overrides*/ 65536) {
    			setContext(key, {
    				theme: overrides.themeOverride,
    				styles: {},
    				defaultProps: {}
    			});
    		}

    		if ($$self.$$.dirty & /*themeObserver*/ 2048) {
    			colorScheme.set(themeObserver);
    		}

    		if ($$self.$$.dirty & /*overrides*/ 65536) {
    			mergedTheme = mergeTheme(DEFAULT_THEME, overrides.themeOverride);
    		}

    		if ($$self.$$.dirty & /*override*/ 16384) {
    			$$invalidate(4, { cx, classes } = useStyles(null, { override }), cx, ($$invalidate(3, classes), $$invalidate(14, override)));
    		}
    	};

    	return [
    		element,
    		use,
    		className,
    		classes,
    		cx,
    		forwardEvents,
    		currentTheme,
    		$$restProps,
    		theme,
    		styles,
    		defaultProps,
    		themeObserver,
    		withNormalizeCSS,
    		withGlobalStyles,
    		override,
    		inherit,
    		overrides,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class SvelteUIProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$q, safe_not_equal, {
    			use: 1,
    			class: 2,
    			element: 0,
    			theme: 8,
    			styles: 9,
    			defaultProps: 10,
    			themeObserver: 11,
    			withNormalizeCSS: 12,
    			withGlobalStyles: 13,
    			override: 14,
    			inherit: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteUIProvider",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get use() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get theme() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styles() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultProps() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultProps(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get themeObserver() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set themeObserver(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withNormalizeCSS() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withNormalizeCSS(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withGlobalStyles() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withGlobalStyles(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inherit() {
    		throw new Error("<SvelteUIProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inherit(value) {
    		throw new Error("<SvelteUIProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SvelteUIProvider$1 = SvelteUIProvider;

    function themeColor(color, shade = 0) {
        const theme = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
        let _shade = '50';
        if (!isSvelteUIColor(color))
            return color;
        if (shade !== Number(0))
            _shade = `${shade.toString()}00`;
        return theme.colors[`${color}${_shade}`]?.value;
    }
    function isSvelteUIColor(color) {
        let valid = false;
        switch (color) {
            case 'dark':
                valid = true;
                break;
            case 'gray':
                valid = true;
                break;
            case 'red':
                valid = true;
                break;
            case 'pink':
                valid = true;
                break;
            case 'grape':
                valid = true;
                break;
            case 'violet':
                valid = true;
                break;
            case 'indigo':
                valid = true;
                break;
            case 'blue':
                valid = true;
                break;
            case 'cyan':
                valid = true;
                break;
            case 'teal':
                valid = true;
                break;
            case 'green':
                valid = true;
                break;
            case 'lime':
                valid = true;
                break;
            case 'yellow':
                valid = true;
                break;
            case 'orange':
                valid = true;
                break;
            default:
                valid = false;
                break;
        }
        return valid;
    }

    function size$1(props) {
        if (typeof props.size === 'number') {
            return props.size;
        }
        if (typeof props.sizes[props.size] === 'number') {
            return props.sizes[props.size];
        }
        return +props.sizes[props.size]?.value || +props.sizes.md?.value;
    }

    function radius(radii) {
        const theme = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
        if (typeof radii === 'number') {
            return radii;
        }
        return theme.radii[radii].value;
    }

    function isHexColor(hex) {
        const replaced = hex.replace('#', '');
        return (typeof replaced === 'string' && replaced.length === 6 && !Number.isNaN(Number(`0x${replaced}`)));
    }
    function hexToRgba(color) {
        const replaced = color.replace('#', '');
        const parsed = parseInt(replaced, 16);
        const r = (parsed >> 16) & 255;
        const g = (parsed >> 8) & 255;
        const b = parsed & 255;
        return {
            r,
            g,
            b,
            a: 1
        };
    }
    function rgbStringToRgba(color) {
        const [r, g, b, a] = color
            .replace(/[^0-9,.]/g, '')
            .split(',')
            .map(Number);
        return { r, g, b, a: a || 1 };
    }
    function toRgba(color) {
        if (isHexColor(color)) {
            return hexToRgba(color);
        }
        if (color.startsWith('rgb')) {
            return rgbStringToRgba(color);
        }
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        };
    }

    const vFunc = (color, gradient) => {
        const { themeColor, rgba } = fns;
        const disabled = {
            '&.disabled': {
                pointerEvents: 'none',
                borderColor: 'transparent',
                backgroundColor: 'rgb(233, 236, 239)',
                background: 'rgb(233, 236, 239)',
                color: 'rgb(173, 181, 189)',
                cursor: 'not-allowed'
            }
        };
        const variants = {
            /** Filled variant */
            filled: {
                [`${dark.selector} &`]: {
                    backgroundColor: themeColor(color, 8)
                },
                border: 'transparent',
                backgroundColor: themeColor(color, 6),
                color: 'White',
                '&:hover': { backgroundColor: themeColor(color, 7) },
                ...disabled
            },
            /** Light variant */
            light: {
                [`${dark.selector} &`]: {
                    backgroundColor: rgba(themeColor(color, 8), 0.35),
                    color: color === 'dark' ? themeColor('dark', 0) : themeColor(color, 2),
                    '&:hover': { backgroundColor: rgba(themeColor(color, 7), 0.45) }
                },
                border: 'transparent',
                backgroundColor: themeColor(color, 0),
                color: color === 'dark' ? themeColor('dark', 9) : themeColor(color, 6),
                '&:hover': { backgroundColor: themeColor(color, 1) },
                ...disabled
            },
            /** Outline variant */
            outline: {
                [`${dark.selector} &`]: {
                    border: `1px solid ${themeColor(color, 4)}`,
                    color: `${themeColor(color, 4)}`,
                    '&:hover': { backgroundColor: rgba(themeColor(color, 4), 0.05) }
                },
                border: `1px solid ${themeColor(color, 7)}`,
                backgroundColor: 'transparent',
                color: themeColor(color, 7),
                '&:hover': {
                    backgroundColor: rgba(themeColor(color, 0), 0.35)
                },
                ...disabled
            },
            /** Subtle variant */
            subtle: {
                [`${dark.selector} &`]: {
                    color: color === 'dark' ? themeColor('dark', 0) : themeColor(color, 2),
                    '&:hover': { backgroundColor: rgba(themeColor(color, 8), 0.35) }
                },
                border: 'transparent',
                backgroundColor: 'transparent',
                color: color === 'dark' ? themeColor('dark', 9) : themeColor(color, 6),
                '&:hover': {
                    backgroundColor: themeColor(color, 0)
                },
                ...disabled
            },
            /** Default variant */
            default: {
                [`${dark.selector} &`]: {
                    border: `1px solid ${themeColor('dark', 5)}`,
                    backgroundColor: themeColor('dark', 5),
                    color: 'White',
                    '&:hover': { backgroundColor: themeColor('dark', 4) }
                },
                border: `1px solid ${themeColor('gray', 4)}`,
                backgroundColor: 'White',
                color: 'Black',
                '&:hover': { backgroundColor: themeColor('gray', 0) },
                ...disabled
            },
            /** White variant */
            white: {
                border: 'transparent',
                backgroundColor: 'White',
                color: themeColor(color, 7),
                '&:hover': { backgroundColor: 'White' },
                ...disabled
            },
            gradient: {}
        };
        if (gradient) {
            /** Gradient variant */
            variants.gradient = {
                border: 'transparent',
                background: `linear-gradient(${gradient.deg}deg, $${gradient.from}600 0%, $${gradient.to}600 100%)`,
                color: 'White'
            };
        }
        return variants;
    };

    function randomID(prefix = 'svelteui') {
        return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
    }

    function mergeTheme(currentTheme, themeOverride) {
        if (!themeOverride) {
            return currentTheme;
        }
        return Object.keys(currentTheme).reduce((acc, key) => {
            acc[key] =
                typeof themeOverride[key] === 'object'
                    ? { ...currentTheme[key], ...themeOverride[key] }
                    : typeof themeOverride[key] === 'number'
                        ? themeOverride[key]
                        : themeOverride[key] || currentTheme[key];
            return acc;
        }, {});
    }

    function rgba(color, alpha = 1) {
        if (typeof color !== 'string' || alpha > 1 || alpha < 0) {
            return 'rgba(0, 0, 0, 1)';
        }
        const { r, g, b } = toRgba(color);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const DEFAULT_GRADIENT = {
        from: 'indigo',
        to: 'cyan',
        deg: 45
    };
    /**
     * THe Variant function is a function that takes a variant, optional color/gradient and returns the desired styles for four specific properties.
     *
     * Some styles will return tuples of strings where the first value is the dark version of the specific style, and the second value is the light version.
     *
     * @param VariantInput - an object that has a variant, color, and optional gradient property
     * @returns an object with border, background, color, and hover property styles based on the variant
     */
    function variant({ variant, color, gradient }) {
        const theme = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
        const primaryShade = 6;
        if (variant === 'light') {
            return {
                border: 'transparent',
                background: [rgba(themeColor(color, 8), 0.35), rgba(themeColor(color, 0), 1)],
                color: [
                    color === 'dark' ? themeColor('dark', 0) : themeColor(color, 2),
                    color === 'dark' ? themeColor('dark', 9) : themeColor(color, primaryShade)
                ],
                // themeColor(color, theme.colorScheme === 'dark' ? 2 : getPrimaryShade('light')),
                hover: [rgba(themeColor(color, 7), 0.45), rgba(themeColor(color, 1), 0.65)]
            };
        }
        if (variant === 'default') {
            return {
                border: [themeColor('dark', 5), themeColor('gray', 4)],
                background: [themeColor('dark', 5), theme.colors.white.value],
                color: [theme.colors.white.value, theme.colors.black.value],
                hover: [themeColor('dark', 4), themeColor('gray', 0)]
            };
        }
        if (variant === 'white') {
            return {
                border: 'transparent',
                background: theme.colors.white.value,
                color: themeColor(color, primaryShade),
                hover: null
            };
        }
        if (variant === 'outline') {
            return {
                border: [themeColor(color, 4), themeColor(color, primaryShade)],
                background: 'transparent',
                color: [themeColor(color, 4), themeColor(color, primaryShade)],
                hover: [rgba(themeColor(color, 4), 0.05), rgba(themeColor(color, 0), 0.35)]
            };
        }
        if (variant === 'gradient') {
            const merged = {
                from: gradient?.from || DEFAULT_GRADIENT.from,
                to: gradient?.to || DEFAULT_GRADIENT.to,
                deg: gradient?.deg || DEFAULT_GRADIENT.deg
            };
            return {
                background: `linear-gradient(${merged.deg}deg, ${themeColor(merged.from, primaryShade)} 0%, ${themeColor(merged.to, primaryShade)} 100%)`,
                color: theme.colors.white.value,
                border: 'transparent',
                hover: null
            };
        }
        if (variant === 'subtle') {
            return {
                border: 'transparent',
                background: 'transparent',
                color: [
                    color === 'dark' ? themeColor('dark', 0) : themeColor(color, 2),
                    color === 'dark' ? themeColor('dark', 9) : themeColor(color, primaryShade)
                ],
                hover: [rgba(themeColor(color, 8), 0.35), rgba(themeColor(color, 0), 1)]
            };
        }
        return {
            border: 'transparent',
            background: [themeColor(color, 8), themeColor(color, primaryShade)],
            color: theme.colors.white.value,
            hover: themeColor(color, 7)
        };
    }

    const fns = {
        size: size$1,
        radius,
        themeColor,
        variant,
        rgba
    };

    const colors = {
        primary: '#228be6',
        white: '#ffffff',
        black: '#000000',
        dark50: '#C1C2C5',
        dark100: '#A6A7AB',
        dark200: '#909296',
        dark300: '#5c5f66',
        dark400: '#373A40',
        dark500: '#2C2E33',
        dark600: '#25262b',
        dark700: '#1A1B1E',
        dark800: '#141517',
        dark900: '#101113',
        gray50: '#f8f9fa',
        gray100: '#f1f3f5',
        gray200: '#e9ecef',
        gray300: '#dee2e6',
        gray400: '#ced4da',
        gray500: '#adb5bd',
        gray600: '#868e96',
        gray700: '#495057',
        gray800: '#343a40',
        gray900: '#212529',
        red50: '#fff5f5',
        red100: '#ffe3e3',
        red200: '#ffc9c9',
        red300: '#ffa8a8',
        red400: '#ff8787',
        red500: '#ff6b6b',
        red600: '#fa5252',
        red700: '#f03e3e',
        red800: '#e03131',
        red900: '#c92a2a',
        pink50: '#fff0f6',
        pink100: '#ffdeeb',
        pink200: '#fcc2d7',
        pink300: '#faa2c1',
        pink400: '#f783ac',
        pink500: '#f06595',
        pink600: '#e64980',
        pink700: '#d6336c',
        pink800: '#c2255c',
        pink900: '#a61e4d',
        grape50: '#f8f0fc',
        grape100: '#f3d9fa',
        grape200: '#eebefa',
        grape300: '#e599f7',
        grape400: '#da77f2',
        grape500: '#cc5de8',
        grape600: '#be4bdb',
        grape700: '#ae3ec9',
        grape800: '#9c36b5',
        grape900: '#862e9c',
        violet50: '#f3f0ff',
        violet100: '#e5dbff',
        violet200: '#d0bfff',
        violet300: '#b197fc',
        violet400: '#9775fa',
        violet500: '#845ef7',
        violet600: '#7950f2',
        violet700: '#7048e8',
        violet800: '#6741d9',
        violet900: '#5f3dc4',
        indigo50: '#edf2ff',
        indigo100: '#dbe4ff',
        indigo200: '#bac8ff',
        indigo300: '#91a7ff',
        indigo400: '#748ffc',
        indigo500: '#5c7cfa',
        indigo600: '#4c6ef5',
        indigo700: '#4263eb',
        indigo800: '#3b5bdb',
        indigo900: '#364fc7',
        blue50: '#e7f5ff',
        blue100: '#d0ebff',
        blue200: '#a5d8ff',
        blue300: '#74c0fc',
        blue400: '#4dabf7',
        blue500: '#339af0',
        blue600: '#228be6',
        blue700: '#1c7ed6',
        blue800: '#1971c2',
        blue900: '#1864ab',
        cyan50: '#e3fafc',
        cyan100: '#c5f6fa',
        cyan200: '#99e9f2',
        cyan300: '#66d9e8',
        cyan400: '#3bc9db',
        cyan500: '#22b8cf',
        cyan600: '#15aabf',
        cyan700: '#1098ad',
        cyan800: '#0c8599',
        cyan900: '#0b7285',
        teal50: '#e6fcf5',
        teal100: '#c3fae8',
        teal200: '#96f2d7',
        teal300: '#63e6be',
        teal400: '#38d9a9',
        teal500: '#20c997',
        teal600: '#12b886',
        teal700: '#0ca678',
        teal800: '#099268',
        teal900: '#087f5b',
        green50: '#ebfbee',
        green100: '#d3f9d8',
        green200: '#b2f2bb',
        green300: '#8ce99a',
        green400: '#69db7c',
        green500: '#51cf66',
        green600: '#40c057',
        green700: '#37b24d',
        green800: '#2f9e44',
        green900: '#2b8a3e',
        lime50: '#f4fce3',
        lime100: '#e9fac8',
        lime200: '#d8f5a2',
        lime300: '#c0eb75',
        lime400: '#a9e34b',
        lime500: '#94d82d',
        lime600: '#82c91e',
        lime700: '#74b816',
        lime800: '#66a80f',
        lime900: '#5c940d',
        yellow50: '#fff9db',
        yellow100: '#fff3bf',
        yellow200: '#ffec99',
        yellow300: '#ffe066',
        yellow400: '#ffd43b',
        yellow500: '#fcc419',
        yellow600: '#fab005',
        yellow700: '#f59f00',
        yellow800: '#f08c00',
        yellow900: '#e67700',
        orange50: '#fff4e6',
        orange100: '#ffe8cc',
        orange200: '#ffd8a8',
        orange300: '#ffc078',
        orange400: '#ffa94d',
        orange500: '#ff922b',
        orange600: '#fd7e14',
        orange700: '#f76707',
        orange800: '#e8590c',
        orange900: '#d9480f'
    };
    const colorNameMap = {
        blue: 'blue',
        cyan: 'cyan',
        dark: 'dark',
        grape: 'grape',
        gray: 'gray',
        green: 'green',
        indigo: 'indigo',
        lime: 'lime',
        orange: 'orange',
        pink: 'pink',
        red: 'red',
        teal: 'teal',
        violet: 'violet',
        yellow: 'yellow'
    };

    const hasOwn = {}.hasOwnProperty;
    function cx(...args) {
        const classes = [];
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (!arg)
                continue;
            const argType = typeof arg;
            if (argType === 'string' || argType === 'number') {
                classes.push(arg);
            }
            else if (Array.isArray(arg)) {
                if (arg.length) {
                    const inner = { ...arg };
                    if (inner) {
                        classes.push(inner);
                    }
                }
            }
            else if (argType === 'object') {
                if (arg.toString === Object.prototype.toString) {
                    for (const key in arg) {
                        if (hasOwn.call(arg, key) && arg[key]) {
                            classes.push(key);
                        }
                    }
                }
                else {
                    classes.push(arg.toString());
                }
            }
        }
        return classes.join(' ');
    }
    function cssFactory() {
        // This is a factory function to allow for scalability
        return { cx };
    }

    function fromEntries(entries) {
        const o = {};
        Object.keys(entries).forEach((key) => {
            const [k, v] = entries[key];
            o[k] = v;
        });
        return o;
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const CLASS_KEY = 'svelteui';
    function createRef(refName) {
        return `__svelteui-ref-${refName || ''}`;
    }
    /**
     * Sanitizes the provided CSS object, converting certain keywords to
     * respective CSS selectors, transforms keys into generated CSS classes
     * and returns the mapping between these generated classes and their initial
     * keys.
     *
     * @param object The CSS object that has not yet been sanitized.
     * @param theme The current theme object.
     * @param ref The ref object.
     * @returns The class map that maps the name of the key in the CSS object
     * and the generated hash class.
     */
    function sanitizeCss(object, theme) {
        // builds this to map the generated class name to the class key
        // given in the CSS object
        const refs = [];
        const classMap = {};
        const _sanitize = (obj) => {
            Object.keys(obj).map((value) => {
                // transforms certain keywords into the correct CSS selectors
                if (value === 'variants')
                    return;
                // saves the reference value so that later it can be added
                // to reference the CSS selector
                if (value === 'ref') {
                    refs.push(obj.ref);
                }
                if (value === 'darkMode') {
                    obj[`${theme.dark} &`] = obj.darkMode;
                }
                // returns the recursive call if the CSS is not an object
                if (obj[value] === null || typeof obj[value] !== 'object')
                    return;
                // calls the sanitize method recursively so that it can sanitize
                // all the style objects
                _sanitize(obj[value]);
                // removes the darkMode style since it has been switched
                // to the correct CSS selector
                if (value === 'darkMode') {
                    delete obj[value];
                }
                else if (value.startsWith('@media')) ;
                // only adds the correct selectors if it has none
                else if (!value.startsWith('&') && !value.startsWith(theme.dark)) {
                    const getStyles = css(obj[value]);
                    classMap[value] = getStyles().toString();
                    obj[`& .${getStyles().toString()}`] = obj[value];
                    delete obj[value];
                }
            });
        };
        _sanitize(object);
        // deletes the root key since it won't be sanitized here
        delete object['& .root'];
        return { classMap, refs: Array.from(new Set(refs)) };
    }
    function createStyles(input) {
        const getCssObject = typeof input === 'function' ? input : () => input;
        function useStyles(params = {}, options) {
            // uses the theme present in the current context or fallbacks to the default theme
            const theme = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
            const { cx } = cssFactory();
            const { override, name } = options || {};
            const dirtyCssObject = getCssObject(theme, params, createRef);
            // builds the CSS object that contains transformed values
            const sanitizedCss = Object.assign({}, dirtyCssObject);
            const { classMap, refs } = sanitizeCss(sanitizedCss, theme);
            const root = dirtyCssObject['root'] ?? undefined;
            const cssObjectClean = root !== undefined ? { ...root, ...sanitizedCss } : dirtyCssObject;
            const getStyles = css(cssObjectClean);
            // transforms the keys into strings to be consumed by the classes
            const classes = fromEntries(Object.keys(dirtyCssObject).map((keys) => {
                const ref = refs.find((r) => r.includes(keys)) ?? '';
                const getRefName = ref?.split('-') ?? [];
                const keyIsRef = ref?.split('-')[getRefName?.length - 1] === keys;
                const value = keys.toString();
                let transformedClasses = classMap[value] ?? value;
                // add the value to the array if the ref provided is valid
                if (ref && keyIsRef) {
                    transformedClasses = `${transformedClasses} ${ref}`;
                }
                // generates the root styles, applying the override styles
                if (keys === 'root') {
                    transformedClasses = getStyles({ css: override }).toString();
                }
                // adds a custom class that can be used to override style
                let libClass = `${CLASS_KEY}-${keys.toString()}`;
                if (name) {
                    libClass = `${CLASS_KEY}-${name}-${keys.toString()}`;
                    transformedClasses = `${transformedClasses} ${libClass}`;
                }
                return [keys, transformedClasses];
            }));
            return {
                cx,
                theme,
                classes,
                getStyles: css(cssObjectClean)
            };
        }
        return useStyles;
    }

    var t="colors",n="sizes",r="space",i={gap:r,gridGap:r,columnGap:r,gridColumnGap:r,rowGap:r,gridRowGap:r,inset:r,insetBlock:r,insetBlockEnd:r,insetBlockStart:r,insetInline:r,insetInlineEnd:r,insetInlineStart:r,margin:r,marginTop:r,marginRight:r,marginBottom:r,marginLeft:r,marginBlock:r,marginBlockEnd:r,marginBlockStart:r,marginInline:r,marginInlineEnd:r,marginInlineStart:r,padding:r,paddingTop:r,paddingRight:r,paddingBottom:r,paddingLeft:r,paddingBlock:r,paddingBlockEnd:r,paddingBlockStart:r,paddingInline:r,paddingInlineEnd:r,paddingInlineStart:r,top:r,right:r,bottom:r,left:r,scrollMargin:r,scrollMarginTop:r,scrollMarginRight:r,scrollMarginBottom:r,scrollMarginLeft:r,scrollMarginX:r,scrollMarginY:r,scrollMarginBlock:r,scrollMarginBlockEnd:r,scrollMarginBlockStart:r,scrollMarginInline:r,scrollMarginInlineEnd:r,scrollMarginInlineStart:r,scrollPadding:r,scrollPaddingTop:r,scrollPaddingRight:r,scrollPaddingBottom:r,scrollPaddingLeft:r,scrollPaddingX:r,scrollPaddingY:r,scrollPaddingBlock:r,scrollPaddingBlockEnd:r,scrollPaddingBlockStart:r,scrollPaddingInline:r,scrollPaddingInlineEnd:r,scrollPaddingInlineStart:r,fontSize:"fontSizes",background:t,backgroundColor:t,backgroundImage:t,borderImage:t,border:t,borderBlock:t,borderBlockEnd:t,borderBlockStart:t,borderBottom:t,borderBottomColor:t,borderColor:t,borderInline:t,borderInlineEnd:t,borderInlineStart:t,borderLeft:t,borderLeftColor:t,borderRight:t,borderRightColor:t,borderTop:t,borderTopColor:t,caretColor:t,color:t,columnRuleColor:t,fill:t,outline:t,outlineColor:t,stroke:t,textDecorationColor:t,fontFamily:"fonts",fontWeight:"fontWeights",lineHeight:"lineHeights",letterSpacing:"letterSpacings",blockSize:n,minBlockSize:n,maxBlockSize:n,inlineSize:n,minInlineSize:n,maxInlineSize:n,width:n,minWidth:n,maxWidth:n,height:n,minHeight:n,maxHeight:n,flexBasis:n,gridTemplateColumns:n,gridTemplateRows:n,borderWidth:"borderWidths",borderTopWidth:"borderWidths",borderRightWidth:"borderWidths",borderBottomWidth:"borderWidths",borderLeftWidth:"borderWidths",borderStyle:"borderStyles",borderTopStyle:"borderStyles",borderRightStyle:"borderStyles",borderBottomStyle:"borderStyles",borderLeftStyle:"borderStyles",borderRadius:"radii",borderTopLeftRadius:"radii",borderTopRightRadius:"radii",borderBottomRightRadius:"radii",borderBottomLeftRadius:"radii",boxShadow:"shadows",textShadow:"shadows",transition:"transitions",zIndex:"zIndices"},o=(e,t)=>"function"==typeof t?{"()":Function.prototype.toString.call(t)}:t,l=()=>{const e=Object.create(null);return (t,n,...r)=>{const i=(e=>JSON.stringify(e,o))(t);return i in e?e[i]:e[i]=n(t,...r)}},s=Symbol.for("sxs.internal"),a=(e,t)=>Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)),c=e=>{for(const t in e)return !0;return !1},{hasOwnProperty:d}=Object.prototype,g=e=>e.includes("-")?e:e.replace(/[A-Z]/g,(e=>"-"+e.toLowerCase())),p=/\s+(?![^()]*\))/,u=e=>t=>e(..."string"==typeof t?String(t).split(p):[t]),h={appearance:e=>({WebkitAppearance:e,appearance:e}),backfaceVisibility:e=>({WebkitBackfaceVisibility:e,backfaceVisibility:e}),backdropFilter:e=>({WebkitBackdropFilter:e,backdropFilter:e}),backgroundClip:e=>({WebkitBackgroundClip:e,backgroundClip:e}),boxDecorationBreak:e=>({WebkitBoxDecorationBreak:e,boxDecorationBreak:e}),clipPath:e=>({WebkitClipPath:e,clipPath:e}),content:e=>({content:e.includes('"')||e.includes("'")||/^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(e)?e:`"${e}"`}),hyphens:e=>({WebkitHyphens:e,hyphens:e}),maskImage:e=>({WebkitMaskImage:e,maskImage:e}),maskSize:e=>({WebkitMaskSize:e,maskSize:e}),tabSize:e=>({MozTabSize:e,tabSize:e}),textSizeAdjust:e=>({WebkitTextSizeAdjust:e,textSizeAdjust:e}),userSelect:e=>({WebkitUserSelect:e,userSelect:e}),marginBlock:u(((e,t)=>({marginBlockStart:e,marginBlockEnd:t||e}))),marginInline:u(((e,t)=>({marginInlineStart:e,marginInlineEnd:t||e}))),maxSize:u(((e,t)=>({maxBlockSize:e,maxInlineSize:t||e}))),minSize:u(((e,t)=>({minBlockSize:e,minInlineSize:t||e}))),paddingBlock:u(((e,t)=>({paddingBlockStart:e,paddingBlockEnd:t||e}))),paddingInline:u(((e,t)=>({paddingInlineStart:e,paddingInlineEnd:t||e})))},f=/([\d.]+)([^]*)/,m=(e,t)=>e.length?e.reduce(((e,n)=>(e.push(...t.map((e=>e.includes("&")?e.replace(/&/g,/[ +>|~]/.test(n)&&/&.*&/.test(e)?`:is(${n})`:n):n+" "+e))),e)),[]):t,b=(e,t)=>e in S&&"string"==typeof t?t.replace(/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,((t,n,r,i)=>n+("stretch"===r?`-moz-available${i};${g(e)}:${n}-webkit-fill-available`:`-moz-fit-content${i};${g(e)}:${n}fit-content`)+i)):String(t),S={blockSize:1,height:1,inlineSize:1,maxBlockSize:1,maxHeight:1,maxInlineSize:1,maxWidth:1,minBlockSize:1,minHeight:1,minInlineSize:1,minWidth:1,width:1},k=e=>e?e+"-":"",y=(e,t,n)=>e.replace(/([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g,((e,r,i,o,l)=>"$"==o==!!i?e:(r||"--"==o?"calc(":"")+"var(--"+("$"===o?k(t)+(l.includes("$")?"":k(n))+l.replace(/\$/g,"-"):l)+")"+(r||"--"==o?"*"+(r||"")+(i||"1")+")":""))),B=/\s*,\s*(?![^()]*\))/,$=Object.prototype.toString,x=(e,t,n,r,i)=>{let o,l,s;const a=(e,t,n)=>{let c,d;const p=e=>{for(c in e){const x=64===c.charCodeAt(0),z=x&&Array.isArray(e[c])?e[c]:[e[c]];for(d of z){const e=/[A-Z]/.test(S=c)?S:S.replace(/-[^]/g,(e=>e[1].toUpperCase())),z="object"==typeof d&&d&&d.toString===$&&(!r.utils[e]||!t.length);if(e in r.utils&&!z){const t=r.utils[e];if(t!==l){l=t,p(t(d)),l=null;continue}}else if(e in h){const t=h[e];if(t!==s){s=t,p(t(d)),s=null;continue}}if(x&&(u=c.slice(1)in r.media?"@media "+r.media[c.slice(1)]:c,c=u.replace(/\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g,((e,t,n,r,i,o)=>{const l=f.test(t),s=.0625*(l?-1:1),[a,c]=l?[r,t]:[t,r];return "("+("="===n[0]?"":">"===n[0]===l?"max-":"min-")+a+":"+("="!==n[0]&&1===n.length?c.replace(f,((e,t,r)=>Number(t)+s*(">"===n?1:-1)+r)):c)+(i?") and ("+(">"===i[0]?"min-":"max-")+a+":"+(1===i.length?o.replace(f,((e,t,n)=>Number(t)+s*(">"===i?-1:1)+n)):o):"")+")"}))),z){const e=x?n.concat(c):[...n],r=x?[...t]:m(t,c.split(B));void 0!==o&&i(I(...o)),o=void 0,a(d,r,e);}else void 0===o&&(o=[[],t,n]),c=x||36!==c.charCodeAt(0)?c:`--${k(r.prefix)}${c.slice(1).replace(/\$/g,"-")}`,d=z?d:"number"==typeof d?d&&e in R?String(d)+"px":String(d):y(b(e,null==d?"":d),r.prefix,r.themeMap[e]),o[0].push(`${x?`${c} `:`${g(c)}:`}${d}`);}}var u,S;};p(e),void 0!==o&&i(I(...o)),o=void 0;};a(e,t,n);},I=(e,t,n)=>`${n.map((e=>`${e}{`)).join("")}${t.length?`${t.join(",")}{`:""}${e.join(";")}${t.length?"}":""}${Array(n.length?n.length+1:0).join("}")}`,R={animationDelay:1,animationDuration:1,backgroundSize:1,blockSize:1,border:1,borderBlock:1,borderBlockEnd:1,borderBlockEndWidth:1,borderBlockStart:1,borderBlockStartWidth:1,borderBlockWidth:1,borderBottom:1,borderBottomLeftRadius:1,borderBottomRightRadius:1,borderBottomWidth:1,borderEndEndRadius:1,borderEndStartRadius:1,borderInlineEnd:1,borderInlineEndWidth:1,borderInlineStart:1,borderInlineStartWidth:1,borderInlineWidth:1,borderLeft:1,borderLeftWidth:1,borderRadius:1,borderRight:1,borderRightWidth:1,borderSpacing:1,borderStartEndRadius:1,borderStartStartRadius:1,borderTop:1,borderTopLeftRadius:1,borderTopRightRadius:1,borderTopWidth:1,borderWidth:1,bottom:1,columnGap:1,columnRule:1,columnRuleWidth:1,columnWidth:1,containIntrinsicSize:1,flexBasis:1,fontSize:1,gap:1,gridAutoColumns:1,gridAutoRows:1,gridTemplateColumns:1,gridTemplateRows:1,height:1,inlineSize:1,inset:1,insetBlock:1,insetBlockEnd:1,insetBlockStart:1,insetInline:1,insetInlineEnd:1,insetInlineStart:1,left:1,letterSpacing:1,margin:1,marginBlock:1,marginBlockEnd:1,marginBlockStart:1,marginBottom:1,marginInline:1,marginInlineEnd:1,marginInlineStart:1,marginLeft:1,marginRight:1,marginTop:1,maxBlockSize:1,maxHeight:1,maxInlineSize:1,maxWidth:1,minBlockSize:1,minHeight:1,minInlineSize:1,minWidth:1,offsetDistance:1,offsetRotate:1,outline:1,outlineOffset:1,outlineWidth:1,overflowClipMargin:1,padding:1,paddingBlock:1,paddingBlockEnd:1,paddingBlockStart:1,paddingBottom:1,paddingInline:1,paddingInlineEnd:1,paddingInlineStart:1,paddingLeft:1,paddingRight:1,paddingTop:1,perspective:1,right:1,rowGap:1,scrollMargin:1,scrollMarginBlock:1,scrollMarginBlockEnd:1,scrollMarginBlockStart:1,scrollMarginBottom:1,scrollMarginInline:1,scrollMarginInlineEnd:1,scrollMarginInlineStart:1,scrollMarginLeft:1,scrollMarginRight:1,scrollMarginTop:1,scrollPadding:1,scrollPaddingBlock:1,scrollPaddingBlockEnd:1,scrollPaddingBlockStart:1,scrollPaddingBottom:1,scrollPaddingInline:1,scrollPaddingInlineEnd:1,scrollPaddingInlineStart:1,scrollPaddingLeft:1,scrollPaddingRight:1,scrollPaddingTop:1,shapeMargin:1,textDecoration:1,textDecorationThickness:1,textIndent:1,textUnderlineOffset:1,top:1,transitionDelay:1,transitionDuration:1,verticalAlign:1,width:1,wordSpacing:1},z=e=>String.fromCharCode(e+(e>25?39:97)),W=e=>(e=>{let t,n="";for(t=Math.abs(e);t>52;t=t/52|0)n=z(t%52)+n;return z(t%52)+n})(((e,t)=>{let n=t.length;for(;n;)e=33*e^t.charCodeAt(--n);return e})(5381,JSON.stringify(e))>>>0),j=["themed","global","styled","onevar","resonevar","allvar","inline"],E=e=>{if(e.href&&!e.href.startsWith(location.origin))return !1;try{return !!e.cssRules}catch(e){return !1}},T=e=>{let t;const n=()=>{const{cssRules:e}=t.sheet;return [].map.call(e,((n,r)=>{const{cssText:i}=n;let o="";if(i.startsWith("--sxs"))return "";if(e[r-1]&&(o=e[r-1].cssText).startsWith("--sxs")){if(!n.cssRules.length)return "";for(const e in t.rules)if(t.rules[e].group===n)return `--sxs{--sxs:${[...t.rules[e].cache].join(" ")}}${i}`;return n.cssRules.length?`${o}${i}`:""}return i})).join("")},r=()=>{if(t){const{rules:e,sheet:n}=t;if(!n.deleteRule){for(;3===Object(Object(n.cssRules)[0]).type;)n.cssRules.splice(0,1);n.cssRules=[];}for(const t in e)delete e[t];}const i=Object(e).styleSheets||[];for(const e of i)if(E(e)){for(let i=0,o=e.cssRules;o[i];++i){const l=Object(o[i]);if(1!==l.type)continue;const s=Object(o[i+1]);if(4!==s.type)continue;++i;const{cssText:a}=l;if(!a.startsWith("--sxs"))continue;const c=a.slice(14,-3).trim().split(/\s+/),d=j[c[0]];d&&(t||(t={sheet:e,reset:r,rules:{},toString:n}),t.rules[d]={group:s,index:i,cache:new Set(c)});}if(t)break}if(!t){const i=(e,t)=>({type:t,cssRules:[],insertRule(e,t){this.cssRules.splice(t,0,i(e,{import:3,undefined:1}[(e.toLowerCase().match(/^@([a-z]+)/)||[])[1]]||4));},get cssText(){return "@media{}"===e?`@media{${[].map.call(this.cssRules,(e=>e.cssText)).join("")}}`:e}});t={sheet:e?(e.head||e).appendChild(document.createElement("style")).sheet:i("","text/css"),rules:{},reset:r,toString:n};}const{sheet:o,rules:l}=t;for(let e=j.length-1;e>=0;--e){const t=j[e];if(!l[t]){const n=j[e+1],r=l[n]?l[n].index:o.cssRules.length;o.insertRule("@media{}",r),o.insertRule(`--sxs{--sxs:${e}}`,r),l[t]={group:o.cssRules[r+1],index:r,cache:new Set([e])};}v(l[t]);}};return r(),t},v=e=>{const t=e.group;let n=t.cssRules.length;e.apply=e=>{try{t.insertRule(e,n),++n;}catch(e){}};},M=Symbol(),w=l(),C=(e,t)=>w(e,(()=>(...n)=>{let r={type:null,composers:new Set};for(const t of n)if(null!=t)if(t[s]){null==r.type&&(r.type=t[s].type);for(const e of t[s].composers)r.composers.add(e);}else t.constructor!==Object||t.$$typeof?null==r.type&&(r.type=t):r.composers.add(P(t,e));return null==r.type&&(r.type="span"),r.composers.size||r.composers.add(["PJLV",{},[],[],{},[]]),L(e,r,t)})),P=({variants:e,compoundVariants:t,defaultVariants:n,...r},i)=>{const o=`${k(i.prefix)}c-${W(r)}`,l=[],s=[],a=Object.create(null),g=[];for(const e in n)a[e]=String(n[e]);if("object"==typeof e&&e)for(const t in e){p=a,u=t,d.call(p,u)||(a[t]="undefined");const n=e[t];for(const e in n){const r={[t]:String(e)};"undefined"===String(e)&&g.push(t);const i=n[e],o=[r,i,!c(i)];l.push(o);}}var p,u;if("object"==typeof t&&t)for(const e of t){let{css:t,...n}=e;t="object"==typeof t&&t||{};for(const e in n)n[e]=String(n[e]);const r=[n,t,!c(t)];s.push(r);}return [o,r,l,s,a,g]},L=(e,t,n)=>{const[r,i,o,l]=O(t.composers),c="function"==typeof t.type||t.type.$$typeof?(e=>{function t(){for(let n=0;n<t[M].length;n++){const[r,i]=t[M][n];e.rules[r].apply(i);}return t[M]=[],null}return t[M]=[],t.rules={},j.forEach((e=>t.rules[e]={apply:n=>t[M].push([e,n])})),t})(n):null,d=(c||n).rules,g=`.${r}${i.length>1?`:where(.${i.slice(1).join(".")})`:""}`,p=s=>{s="object"==typeof s&&s||D;const{css:a,...p}=s,u={};for(const e in o)if(delete p[e],e in s){let t=s[e];"object"==typeof t&&t?u[e]={"@initial":o[e],...t}:(t=String(t),u[e]="undefined"!==t||l.has(e)?t:o[e]);}else u[e]=o[e];const h=new Set([...i]);for(const[r,i,o,l]of t.composers){n.rules.styled.cache.has(r)||(n.rules.styled.cache.add(r),x(i,[`.${r}`],[],e,(e=>{d.styled.apply(e);})));const t=A(o,u,e.media),s=A(l,u,e.media,!0);for(const i of t)if(void 0!==i)for(const[t,o,l]of i){const i=`${r}-${W(o)}-${t}`;h.add(i);const s=(l?n.rules.resonevar:n.rules.onevar).cache,a=l?d.resonevar:d.onevar;s.has(i)||(s.add(i),x(o,[`.${i}`],[],e,(e=>{a.apply(e);})));}for(const t of s)if(void 0!==t)for(const[i,o]of t){const t=`${r}-${W(o)}-${i}`;h.add(t),n.rules.allvar.cache.has(t)||(n.rules.allvar.cache.add(t),x(o,[`.${t}`],[],e,(e=>{d.allvar.apply(e);})));}}if("object"==typeof a&&a){const t=`${r}-i${W(a)}-css`;h.add(t),n.rules.inline.cache.has(t)||(n.rules.inline.cache.add(t),x(a,[`.${t}`],[],e,(e=>{d.inline.apply(e);})));}for(const e of String(s.className||"").trim().split(/\s+/))e&&h.add(e);const f=p.className=[...h].join(" ");return {type:t.type,className:f,selector:g,props:p,toString:()=>f,deferredInjector:c}};return a(p,{className:r,selector:g,[s]:t,toString:()=>(n.rules.styled.cache.has(r)||p(),r)})},O=e=>{let t="";const n=[],r={},i=[];for(const[o,,,,l,s]of e){""===t&&(t=o),n.push(o),i.push(...s);for(const e in l){const t=l[e];(void 0===r[e]||"undefined"!==t||s.includes(t))&&(r[e]=t);}}return [t,n,r,new Set(i)]},A=(e,t,n,r)=>{const i=[];e:for(let[o,l,s]of e){if(s)continue;let e,a=0,c=!1;for(e in o){const r=o[e];let i=t[e];if(i!==r){if("object"!=typeof i||!i)continue e;{let e,t,o=0;for(const l in i){if(r===String(i[l])){if("@initial"!==l){const e=l.slice(1);(t=t||[]).push(e in n?n[e]:l.replace(/^@media ?/,"")),c=!0;}a+=o,e=!0;}++o;}if(t&&t.length&&(l={["@media "+t.join(", ")]:l}),!e)continue e}}}(i[a]=i[a]||[]).push([r?"cv":`${e}-${o[e]}`,l,c]);}return i},D={},H=l(),N=(e,t)=>H(e,(()=>(...n)=>{const r=()=>{for(let r of n){r="object"==typeof r&&r||{};let n=W(r);if(!t.rules.global.cache.has(n)){if(t.rules.global.cache.add(n),"@import"in r){let e=[].indexOf.call(t.sheet.cssRules,t.rules.themed.group)-1;for(let n of [].concat(r["@import"]))n=n.includes('"')||n.includes("'")?n:`"${n}"`,t.sheet.insertRule(`@import ${n};`,e++);delete r["@import"];}x(r,[],[],e,(e=>{t.rules.global.apply(e);}));}}return ""};return a(r,{toString:r})})),V=l(),G=(e,t)=>V(e,(()=>n=>{const r=`${k(e.prefix)}k-${W(n)}`,i=()=>{if(!t.rules.global.cache.has(r)){t.rules.global.cache.add(r);const i=[];x(n,[],[],e,(e=>i.push(e)));const o=`@keyframes ${r}{${i.join("")}}`;t.rules.global.apply(o);}return r};return a(i,{get name(){return i()},toString:i})})),F=class{constructor(e,t,n,r){this.token=null==e?"":String(e),this.value=null==t?"":String(t),this.scale=null==n?"":String(n),this.prefix=null==r?"":String(r);}get computedValue(){return "var("+this.variable+")"}get variable(){return "--"+k(this.prefix)+k(this.scale)+this.token}toString(){return this.computedValue}},J=l(),U=(e,t)=>J(e,(()=>(n,r)=>{r="object"==typeof n&&n||Object(r);const i=`.${n=(n="string"==typeof n?n:"")||`${k(e.prefix)}t-${W(r)}`}`,o={},l=[];for(const t in r){o[t]={};for(const n in r[t]){const i=`--${k(e.prefix)}${t}-${n}`,s=y(String(r[t][n]),e.prefix,t);o[t][n]=new F(n,s,t,e.prefix),l.push(`${i}:${s}`);}}const s=()=>{if(l.length&&!t.rules.themed.cache.has(n)){t.rules.themed.cache.add(n);const i=`${r===e.theme?":root,":""}.${n}{${l.join(";")}}`;t.rules.themed.apply(i);}return n};return {...o,get className(){return s()},selector:i,toString:s}})),Z=l(),X=e=>{let t=!1;const n=Z(e,(e=>{t=!0;const n="prefix"in(e="object"==typeof e&&e||{})?String(e.prefix):"",r="object"==typeof e.media&&e.media||{},o="object"==typeof e.root?e.root||null:globalThis.document||null,l="object"==typeof e.theme&&e.theme||{},s={prefix:n,media:r,theme:l,themeMap:"object"==typeof e.themeMap&&e.themeMap||{...i},utils:"object"==typeof e.utils&&e.utils||{}},a=T(o),c={css:C(s,a),globalCss:N(s,a),keyframes:G(s,a),createTheme:U(s,a),reset(){a.reset(),c.theme.toString();},theme:{},sheet:a,config:s,prefix:n,getCssText:a.toString,toString:a.toString};return String(c.theme=c.createTheme(l)),c}));return t||n.reset(),n};//# sourceMappingUrl=index.map

    const { css, globalCss, keyframes, getCssText, theme: theme$1, createTheme, config, reset } = X({
        prefix: 'svelteui',
        theme: {
            colors,
            space: {
                0: '0rem',
                xs: 10,
                sm: 12,
                md: 16,
                lg: 20,
                xl: 24,
                xsPX: '10px',
                smPX: '12px',
                mdPX: '16px',
                lgPX: '20px',
                xlPX: '24px',
                1: '0.125rem',
                2: '0.25rem',
                3: '0.375rem',
                4: '0.5rem',
                5: '0.625rem',
                6: '0.75rem',
                7: '0.875rem',
                8: '1rem',
                9: '1.25rem',
                10: '1.5rem',
                11: '1.75rem',
                12: '2rem',
                13: '2.25rem',
                14: '2.5rem',
                15: '2.75rem',
                16: '3rem',
                17: '3.5rem',
                18: '4rem',
                20: '5rem',
                24: '6rem',
                28: '7rem',
                32: '8rem',
                36: '9rem',
                40: '10rem',
                44: '11rem',
                48: '12rem',
                52: '13rem',
                56: '14rem',
                60: '15rem',
                64: '16rem',
                72: '18rem',
                80: '20rem',
                96: '24rem'
            },
            fontSizes: {
                xs: '12px',
                sm: '14px',
                md: '16px',
                lg: '18px',
                xl: '20px'
            },
            fonts: {
                standard: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
                mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                fallback: 'Segoe UI, system-ui, sans-serif'
            },
            fontWeights: {
                thin: 100,
                extralight: 200,
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800
            },
            lineHeights: {
                xs: 1,
                sm: 1.25,
                md: 1.5,
                lg: 1.625,
                xl: 1.75
            },
            letterSpacings: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0',
                wide: '0.025em',
                wider: '0.05em',
                widest: '0.1em'
            },
            sizes: {},
            radii: {
                xs: '2px',
                sm: '4px',
                md: '8px',
                lg: '16px',
                xl: '32px',
                squared: '33%',
                rounded: '50%',
                pill: '9999px'
            },
            shadows: {
                xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
                sm: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px',
                md: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
                lg: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px',
                xl: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px'
            },
            zIndices: {
                1: '100',
                2: '200',
                3: '300',
                4: '400',
                5: '500',
                10: '1000',
                max: '9999'
            },
            borderWidths: {
                light: '1px',
                normal: '2px',
                bold: '3px',
                extrabold: '4px',
                black: '5px',
                xs: '1px',
                sm: '2px',
                md: '3px',
                lg: '4px',
                xl: '5px'
            },
            breakpoints: {
                xs: 576,
                sm: 768,
                md: 992,
                lg: 1200,
                xl: 1400
            },
            borderStyles: {},
            transitions: {}
        },
        media: {
            xs: '(min-width: 576px)',
            sm: '(min-width: 768px)',
            md: '(min-width: 992px)',
            lg: '(min-width: 1200px)',
            xl: '(min-width: 1400px)'
        },
        utils: {
            focusRing: (value) => ({
                WebkitTapHighlightColor: 'transparent',
                '&:focus': {
                    outlineOffset: 2,
                    outline: value === 'always' || value === 'auto' ? '2px solid $primary' : 'none'
                },
                '&:focus:not(:focus-visible)': {
                    outline: value === 'auto' || value === 'never' ? 'none' : undefined
                }
            }),
            /** padding top */
            p: (value) => ({
                padding: value
            }),
            pt: (value) => ({
                paddingTop: value
            }),
            pr: (value) => ({
                paddingRight: value
            }),
            pb: (value) => ({
                paddingBottom: value
            }),
            pl: (value) => ({
                paddingLeft: value
            }),
            px: (value) => ({
                paddingLeft: value,
                paddingRight: value
            }),
            py: (value) => ({
                paddingTop: value,
                paddingBottom: value
            }),
            /** margin */
            m: (value) => ({
                margin: value
            }),
            /** margin-top */
            mt: (value) => ({
                marginTop: value
            }),
            mr: (value) => ({
                marginRight: value
            }),
            mb: (value) => ({
                marginBottom: value
            }),
            ml: (value) => ({
                marginLeft: value
            }),
            mx: (value) => ({
                marginLeft: value,
                marginRight: value
            }),
            my: (value) => ({
                marginTop: value,
                marginBottom: value
            }),
            ta: (value) => ({
                textAlign: value
            }),
            tt: (value) => ({
                textTransform: value
            }),
            to: (value) => ({
                textOverflow: value
            }),
            d: (value) => ({ display: value }),
            dflex: (value) => ({
                display: 'flex',
                alignItems: value,
                justifyContent: value
            }),
            fd: (value) => ({
                flexDirection: value
            }),
            fw: (value) => ({ flexWrap: value }),
            ai: (value) => ({
                alignItems: value
            }),
            ac: (value) => ({
                alignContent: value
            }),
            jc: (value) => ({
                justifyContent: value
            }),
            as: (value) => ({
                alignSelf: value
            }),
            fg: (value) => ({ flexGrow: value }),
            fs: (value) => ({
                fontSize: value
            }),
            fb: (value) => ({
                flexBasis: value
            }),
            bc: (value) => ({
                backgroundColor: value
            }),
            bf: (value) => ({
                backdropFilter: value
            }),
            bg: (value) => ({
                background: value
            }),
            bgBlur: (value) => ({
                bf: 'saturate(180%) blur(10px)',
                bg: value
            }),
            bgColor: (value) => ({
                backgroundColor: value
            }),
            backgroundClip: (value) => ({
                WebkitBackgroundClip: value,
                backgroundClip: value
            }),
            bgClip: (value) => ({
                WebkitBackgroundClip: value,
                backgroundClip: value
            }),
            br: (value) => ({
                borderRadius: value
            }),
            bw: (value) => ({
                borderWidth: value
            }),
            btrr: (value) => ({
                borderTopRightRadius: value
            }),
            bbrr: (value) => ({
                borderBottomRightRadius: value
            }),
            bblr: (value) => ({
                borderBottomLeftRadius: value
            }),
            btlr: (value) => ({
                borderTopLeftRadius: value
            }),
            bs: (value) => ({
                boxShadow: value
            }),
            normalShadow: (value) => ({
                boxShadow: `0 4px 14px 0 $${value}`
            }),
            lh: (value) => ({
                lineHeight: value
            }),
            ov: (value) => ({ overflow: value }),
            ox: (value) => ({
                overflowX: value
            }),
            oy: (value) => ({
                overflowY: value
            }),
            pe: (value) => ({
                pointerEvents: value
            }),
            events: (value) => ({
                pointerEvents: value
            }),
            us: (value) => ({
                WebkitUserSelect: value,
                userSelect: value
            }),
            userSelect: (value) => ({
                WebkitUserSelect: value,
                userSelect: value
            }),
            w: (value) => ({ width: value }),
            h: (value) => ({
                height: value
            }),
            minW: (value) => ({
                minWidth: value
            }),
            minH: (value) => ({
                minWidth: value
            }),
            mw: (value) => ({
                maxWidth: value
            }),
            maxW: (value) => ({
                maxWidth: value
            }),
            mh: (value) => ({
                maxHeight: value
            }),
            maxH: (value) => ({
                maxHeight: value
            }),
            size: (value) => ({
                width: value,
                height: value
            }),
            minSize: (value) => ({
                minWidth: value,
                minHeight: value,
                width: value,
                height: value
            }),
            sizeMin: (value) => ({
                minWidth: value,
                minHeight: value,
                width: value,
                height: value
            }),
            maxSize: (value) => ({
                maxWidth: value,
                maxHeight: value
            }),
            sizeMax: (value) => ({
                maxWidth: value,
                maxHeight: value
            }),
            appearance: (value) => ({
                WebkitAppearance: value,
                appearance: value
            }),
            scale: (value) => ({
                transform: `scale(${value})`
            }),
            linearGradient: (value) => ({
                backgroundImage: `linear-gradient(${value})`
            }),
            tdl: (value) => ({
                textDecorationLine: value
            }),
            // Text gradient effect
            textGradient: (value) => ({
                backgroundImage: `linear-gradient(${value})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            })
        },
        themeMap: {
            ...i,
            width: 'space',
            height: 'space',
            minWidth: 'space',
            maxWidth: 'space',
            minHeight: 'space',
            maxHeight: 'space',
            flexBasis: 'space',
            gridTemplateColumns: 'space',
            gridTemplateRows: 'space',
            blockSize: 'space',
            minBlockSize: 'space',
            maxBlockSize: 'space',
            inlineSize: 'space',
            minInlineSize: 'space',
            maxInlineSize: 'space',
            borderWidth: 'borderWeights'
        }
    });
    /** Function for dark theme */
    const dark = createTheme('dark-theme', {
        colors,
        shadows: {
            xs: '-4px 0 15px rgb(0 0 0 / 50%)',
            sm: '0 5px 20px -5px rgba(20, 20, 20, 0.1)',
            md: '0 8px 30px rgba(20, 20, 20, 0.15)',
            lg: '0 30px 60px rgba(20, 20, 20, 0.15)',
            xl: '0 40px 80px rgba(20, 20, 20, 0.25)'
        }
    });
    /** Global styles for SvelteUI */
    const SvelteUIGlobalCSS = globalCss({
        a: {
            focusRing: 'auto'
        },
        body: {
            [`${dark.selector} &`]: {
                backgroundColor: '$dark700',
                color: '$dark50'
            },
            backgroundColor: '$white',
            color: '$black'
        }
    });
    /** Normalize css function */
    const NormalizeCSS = globalCss({
        html: {
            fontFamily: 'sans-serif',
            lineHeight: '1.15',
            textSizeAdjust: '100%',
            margin: 0
        },
        body: {
            margin: 0
        },
        'article, aside, footer, header, nav, section, figcaption, figure, main': {
            display: 'block'
        },
        h1: {
            fontSize: '2em',
            margin: 0
        },
        hr: {
            boxSizing: 'content-box',
            height: 0,
            overflow: 'visible'
        },
        pre: {
            fontFamily: 'monospace, monospace',
            fontSize: '1em'
        },
        a: {
            background: 'transparent',
            textDecorationSkip: 'objects'
        },
        'a:active, a:hover': {
            outlineWidth: 0
        },
        'abbr[title]': {
            borderBottom: 'none',
            textDecoration: 'underline'
        },
        'b, strong': {
            fontWeight: 'bolder'
        },
        'code, kbp, samp': {
            fontFamily: 'monospace, monospace',
            fontSize: '1em'
        },
        dfn: {
            fontStyle: 'italic'
        },
        mark: {
            backgroundColor: '#ff0',
            color: '#000'
        },
        small: {
            fontSize: '80%'
        },
        'sub, sup': {
            fontSize: '75%',
            lineHeight: 0,
            position: 'relative',
            verticalAlign: 'baseline'
        },
        sup: {
            top: '-0.5em'
        },
        sub: {
            bottom: '-0.25em'
        },
        'audio, video': {
            display: 'inline-block'
        },
        'audio:not([controls])': {
            display: 'none',
            height: 0
        },
        img: {
            borderStyle: 'none',
            verticalAlign: 'middle'
        },
        'svg:not(:root)': {
            overflow: 'hidden'
        },
        'button, input, optgroup, select, textarea': {
            fontFamily: 'sans-serif',
            fontSize: '100%',
            lineHeight: '1.15',
            margin: 0
        },
        'button, input': {
            overflow: 'visible'
        },
        'button, select': {
            textTransform: 'none'
        },
        'button, [type=reset], [type=submit]': {
            WebkitAppearance: 'button'
        },
        'button::-moz-focus-inner, [type=button]::-moz-focus-inner, [type=reset]::-moz-focus-inner, [type=submit]::-moz-focus-inner': {
            borderStyle: 'none',
            padding: 0
        },
        'button:-moz-focusring, [type=button]:-moz-focusring, [type=reset]:-moz-focusring, [type=submit]:-moz-focusring': {
            outline: '1px dotted ButtonText'
        },
        legend: {
            boxSizing: 'border-box',
            color: 'inherit',
            display: 'table',
            maxWidth: '100%',
            padding: 0,
            whiteSpace: 'normal'
        },
        progress: {
            display: 'inline-block',
            verticalAlign: 'baseline'
        },
        textarea: {
            overflow: 'auto'
        },
        '[type=checkbox], [type=radio]': {
            boxSizing: 'border-box',
            padding: 0
        },
        '[type=number]::-webkit-inner-spin-button, [type=number]::-webkit-outer-spin-button': {
            height: 'auto'
        },
        '[type=search]': {
            appearance: 'textfield',
            outlineOffset: '-2px'
        },
        '[type=search]::-webkit-search-cancel-button, [type=search]::-webkit-search-decoration': {
            appearance: 'none'
        },
        '::-webkit-file-upload-button': {
            appearance: 'button',
            font: 'inherit'
        },
        'details, menu': {
            display: 'block'
        },
        summary: {
            display: 'list-item'
        },
        canvas: {
            display: 'inline-block'
        },
        template: {
            display: 'none'
        },
        '[hidden]': {
            display: 'none'
        }
    });

    const sizes$1 = {
        xs: 18,
        sm: 22,
        md: 28,
        lg: 34,
        xl: 44
    };
    function getVariantStyles(color, variant) {
        const ctx = { from: 'indigo', to: 'cyan', deg: 45 };
        if (variant === 'hover' || variant === 'transparent') {
            return {
                [`${variant}`]: {
                    [`${dark.selector} &`]: {
                        color: `$${color}800`,
                        '&:hover': { backgroundColor: variant === 'transparent' ? null : `$dark800` }
                    },
                    border: '1px solid transparent',
                    backgroundColor: 'transparent',
                    color: `$${color}700`,
                    '&:hover': { backgroundColor: variant === 'transparent' ? null : `$${color}50` },
                    '&:disabled': {
                        pointerEvents: 'none',
                        borderColor: 'transparent',
                        backgroundColor: 'rgb(233, 236, 239)',
                        background: 'rgb(233, 236, 239)',
                        color: 'rgb(173, 181, 189)',
                        cursor: 'not-allowed'
                    }
                }
            };
        }
        return vFunc(color, ctx);
    }
    var useStyles$7 = createStyles((_, { color, radius, size, variant }) => {
        return {
            root: {
                focusRing: 'auto',
                position: 'relative',
                appearance: 'none',
                WebkitAppearance: 'none',
                WebkitTapHighlightColor: 'transparent',
                boxSizing: 'border-box',
                height: typeof size === 'string' ? sizes$1[size] : `${size}px`,
                minHeight: typeof size === 'string' ? sizes$1[size] : `${size}px`,
                width: typeof size === 'string' ? sizes$1[size] : `${size}px`,
                minWidth: typeof size === 'string' ? sizes$1[size] : `${size}px`,
                borderRadius: `$${radius}`,
                padding: 0,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:not(:disabled):active': {
                    transform: 'translateY(1px)'
                },
                '&.disabled': {
                    pointerEvents: 'none',
                    borderColor: 'transparent',
                    backgroundColor: 'rgb(233, 236, 239)',
                    background: 'rgb(233, 236, 239)',
                    color: 'rgb(173, 181, 189)',
                    cursor: 'not-allowed'
                },
                '&.loading': {
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -1,
                        left: -1,
                        right: -1,
                        bottom: -1,
                        backgroundColor: 'rgba(255, 255, 255, .5)',
                        borderRadius: `$${radius}`,
                        cursor: 'not-allowed'
                    }
                }
            },
            variants: {
                variation: getVariantStyles(color, variant)
            }
        };
    });

    /** Error codes for component Text
     *
     * `Object.freeze` is needed to keep modification outside of the object unavailable
     *
     * ## Code 1:
     * If using the 'href' prop, set 'root' prop to an anchor ('a') tag
     *
     */
    const ActionIconErrors = Object.freeze([
        {
            error: true,
            message: "If using the 'href' prop, set 'root' prop to an anchor ('a') tag",
            solution: `
                If your component looks like this:

                &lt;ActionIcon href='https://example.com'&gt;
                          ^^^ - Try adding prop root='a'
                       &lt;Icon /&gt;
                &lt;/ActionIcon&gt;
                `
        }
    ]);

    const SYSTEM_PROPS = {
        mt: 'marginTop',
        mb: 'marginBottom',
        ml: 'marginLeft',
        mr: 'marginRight',
        pt: 'paddingTop',
        pb: 'paddingBottom',
        pl: 'paddingLeft',
        pr: 'paddingRight'
    };
    const NEGATIVE_VALUES = ['-xs', '-sm', '-md', '-lg', '-xl'];
    function isValidSizeValue(margin) {
        return typeof margin === 'string' || typeof margin === 'number';
    }
    function getSizeValue(margin, theme) {
        if (NEGATIVE_VALUES.includes(margin)) {
            return theme.fn.size({ size: margin.replace('-', ''), sizes: theme.space }) * -1;
        }
        return theme.fn.size({ size: margin, sizes: theme.space });
    }
    function getSystemStyles(systemStyles, theme) {
        const styles = {};
        if (isValidSizeValue(systemStyles.p)) {
            const value = getSizeValue(systemStyles.p, theme);
            styles.padding = value;
        }
        if (isValidSizeValue(systemStyles.m)) {
            const value = getSizeValue(systemStyles.m, theme);
            styles.margin = value;
        }
        if (isValidSizeValue(systemStyles.py)) {
            const value = getSizeValue(systemStyles.py, theme);
            styles.paddingTop = value;
            styles.paddingBottom = value;
        }
        if (isValidSizeValue(systemStyles.px)) {
            const value = getSizeValue(systemStyles.px, theme);
            styles.paddingLeft = value;
            styles.paddingRight = value;
        }
        if (isValidSizeValue(systemStyles.my)) {
            const value = getSizeValue(systemStyles.my, theme);
            styles.marginTop = value;
            styles.marginBottom = value;
        }
        if (isValidSizeValue(systemStyles.mx)) {
            const value = getSizeValue(systemStyles.mx, theme);
            styles.marginLeft = value;
            styles.marginRight = value;
        }
        Object.keys(SYSTEM_PROPS).forEach((property) => {
            if (isValidSizeValue(systemStyles[property])) {
                styles[SYSTEM_PROPS[property]] = theme.fn.size({
                    size: getSizeValue(systemStyles[property], theme),
                    sizes: theme.space
                });
            }
        });
        return styles;
    }

    /* node_modules/@svelteuidev/core/components/Box/Box.svelte generated by Svelte v3.55.1 */
    const file$h = "node_modules/@svelteuidev/core/components/Box/Box.svelte";

    // (74:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[28].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);

    	let div_levels = [
    		{
    			class: div_class_value = "" + (/*className*/ ctx[2] + " " + /*BoxStyles*/ ctx[7]({
    				css: {
    					.../*getCSSStyles*/ ctx[11](/*theme*/ ctx[10]),
    					.../*systemStyles*/ ctx[6]
    				}
    			}))
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$h, 74, 1, 2269);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[31](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[8].call(null, div)),
    					action_destroyer(useActions_action = useActions$1.call(null, div, /*use*/ ctx[1]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[32], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className, BoxStyles, systemStyles*/ 196 && div_class_value !== (div_class_value = "" + (/*className*/ ctx[2] + " " + /*BoxStyles*/ ctx[7]({
    					css: {
    						.../*getCSSStyles*/ ctx[11](/*theme*/ ctx[10]),
    						.../*systemStyles*/ ctx[6]
    					}
    				})))) && { class: div_class_value },
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(74:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:50) 
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[8], [useActions$1, /*use*/ ctx[1]]]
    		},
    		{
    			class: "" + (/*className*/ ctx[2] + " " + /*BoxStyles*/ ctx[7]({
    				css: {
    					.../*getCSSStyles*/ ctx[11](/*theme*/ ctx[10]),
    					.../*systemStyles*/ ctx[6]
    				}
    			}))
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	var switch_value = /*root*/ ctx[3];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$a] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    		/*switch_instance_binding*/ ctx[30](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*forwardEvents, use, className, BoxStyles, getCSSStyles, theme, systemStyles, $$restProps*/ 7622)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*forwardEvents, use*/ 258 && {
    						use: [/*forwardEvents*/ ctx[8], [useActions$1, /*use*/ ctx[1]]]
    					},
    					dirty[0] & /*className, BoxStyles, getCSSStyles, theme, systemStyles*/ 3268 && {
    						class: "" + (/*className*/ ctx[2] + " " + /*BoxStyles*/ ctx[7]({
    							css: {
    								.../*getCSSStyles*/ ctx[11](/*theme*/ ctx[10]),
    								.../*systemStyles*/ ctx[6]
    							}
    						}))
    					},
    					dirty[0] & /*$$restProps*/ 4096 && get_spread_object(/*$$restProps*/ ctx[12])
    				])
    			: {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*root*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					/*switch_instance_binding*/ ctx[30](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[30](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(64:50) ",
    		ctx
    	});

    	return block;
    }

    // (52:0) {#if isHTMLElement}
    function create_if_block$5(ctx) {
    	let previous_tag = /*castRoot*/ ctx[9]();
    	let svelte_element_anchor;
    	let current;
    	validate_dynamic_element(/*castRoot*/ ctx[9]());
    	validate_void_dynamic_element(/*castRoot*/ ctx[9]());
    	let svelte_element = /*castRoot*/ ctx[9]() && create_dynamic_element(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*castRoot*/ ctx[9]()) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*castRoot*/ ctx[9]())) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*castRoot*/ ctx[9]());
    					validate_void_dynamic_element(/*castRoot*/ ctx[9]());
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*castRoot*/ ctx[9]();
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelte_element);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelte_element);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(52:0) {#if isHTMLElement}",
    		ctx
    	});

    	return block;
    }

    // (65:1) <svelte:component   this={root}   bind:this={element}   use={[forwardEvents, [useActions, use]]}   class="{className} {BoxStyles({ css: { ...getCSSStyles(theme), ...systemStyles } })}"   {...$$restProps}  >
    function create_default_slot$a(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[28].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[32], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(65:1) <svelte:component   this={root}   bind:this={element}   use={[forwardEvents, [useActions, use]]}   class=\\\"{className} {BoxStyles({ css: { ...getCSSStyles(theme), ...systemStyles } })}\\\"   {...$$restProps}  >",
    		ctx
    	});

    	return block;
    }

    // (54:1) <svelte:element   bind:this={element}   this={castRoot()}   use:forwardEvents   use:useActions={use}   class="{className} {BoxStyles({ css: {...getCSSStyles(theme), ...systemStyles} })}"   {...$$restProps}  >
    function create_dynamic_element(ctx) {
    	let svelte_element;
    	let svelte_element_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[28].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);

    	let svelte_element_levels = [
    		{
    			class: svelte_element_class_value = "" + (/*className*/ ctx[2] + " " + /*BoxStyles*/ ctx[7]({
    				css: {
    					.../*getCSSStyles*/ ctx[11](/*theme*/ ctx[10]),
    					.../*systemStyles*/ ctx[6]
    				}
    			}))
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*castRoot*/ ctx[9]());
    			if (default_slot) default_slot.c();

    			if ((/-/).test(/*castRoot*/ ctx[9]())) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}

    			add_location(svelte_element, file$h, 53, 1, 1725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			if (default_slot) {
    				default_slot.m(svelte_element, null);
    			}

    			/*svelte_element_binding*/ ctx[29](svelte_element);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[8].call(null, svelte_element)),
    					action_destroyer(useActions_action = useActions$1.call(null, svelte_element, /*use*/ ctx[1]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[32], dirty, null),
    						null
    					);
    				}
    			}

    			svelte_element_data = get_spread_update(svelte_element_levels, [
    				(!current || dirty[0] & /*className, BoxStyles, systemStyles*/ 196 && svelte_element_class_value !== (svelte_element_class_value = "" + (/*className*/ ctx[2] + " " + /*BoxStyles*/ ctx[7]({
    					css: {
    						.../*getCSSStyles*/ ctx[11](/*theme*/ ctx[10]),
    						.../*systemStyles*/ ctx[6]
    					}
    				})))) && { class: svelte_element_class_value },
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]);

    			if ((/-/).test(/*castRoot*/ ctx[9]())) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			if (default_slot) default_slot.d(detaching);
    			/*svelte_element_binding*/ ctx[29](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element.name,
    		type: "child_dynamic_element",
    		source: "(54:1) <svelte:element   bind:this={element}   this={castRoot()}   use:forwardEvents   use:useActions={use}   class=\\\"{className} {BoxStyles({ css: {...getCSSStyles(theme), ...systemStyles} })}\\\"   {...$$restProps}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_if_block_1$2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isHTMLElement*/ ctx[4]) return 0;
    		if (/*isComponent*/ ctx[5] && typeof /*root*/ ctx[3] !== 'string') return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let BoxStyles;
    	let systemStyles;

    	const omit_props_names = [
    		"use","element","class","css","root","m","my","mx","mt","mb","ml","mr","p","py","px","pt","pb","pl","pr"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Box', slots, ['default']);
    	let { use = [], element = undefined, class: className = '', css: css$1 = {}, root = undefined, m = undefined, my = undefined, mx = undefined, mt = undefined, mb = undefined, ml = undefined, mr = undefined, p = undefined, py = undefined, px = undefined, pt = undefined, pb = undefined, pl = undefined, pr = undefined } = $$props;

    	/** An action that forwards inner dom node events from parent component */
    	const forwardEvents = createEventForwarder(get_current_component());

    	/** workaround for root type errors, this should be replaced by a better type system */
    	const castRoot = () => root;

    	const theme = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
    	const getCSSStyles = typeof css$1 === 'function' ? css$1 : () => css$1;
    	let isHTMLElement;
    	let isComponent;

    	function svelte_element_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('css' in $$new_props) $$invalidate(13, css$1 = $$new_props.css);
    		if ('root' in $$new_props) $$invalidate(3, root = $$new_props.root);
    		if ('m' in $$new_props) $$invalidate(14, m = $$new_props.m);
    		if ('my' in $$new_props) $$invalidate(15, my = $$new_props.my);
    		if ('mx' in $$new_props) $$invalidate(16, mx = $$new_props.mx);
    		if ('mt' in $$new_props) $$invalidate(17, mt = $$new_props.mt);
    		if ('mb' in $$new_props) $$invalidate(18, mb = $$new_props.mb);
    		if ('ml' in $$new_props) $$invalidate(19, ml = $$new_props.ml);
    		if ('mr' in $$new_props) $$invalidate(20, mr = $$new_props.mr);
    		if ('p' in $$new_props) $$invalidate(21, p = $$new_props.p);
    		if ('py' in $$new_props) $$invalidate(22, py = $$new_props.py);
    		if ('px' in $$new_props) $$invalidate(23, px = $$new_props.px);
    		if ('pt' in $$new_props) $$invalidate(24, pt = $$new_props.pt);
    		if ('pb' in $$new_props) $$invalidate(25, pb = $$new_props.pb);
    		if ('pl' in $$new_props) $$invalidate(26, pl = $$new_props.pl);
    		if ('pr' in $$new_props) $$invalidate(27, pr = $$new_props.pr);
    		if ('$$scope' in $$new_props) $$invalidate(32, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getSystemStyles,
    		_css: css,
    		useSvelteUITheme,
    		useSvelteUIThemeContext,
    		createEventForwarder,
    		useActions: useActions$1,
    		get_current_component,
    		use,
    		element,
    		className,
    		css: css$1,
    		root,
    		m,
    		my,
    		mx,
    		mt,
    		mb,
    		ml,
    		mr,
    		p,
    		py,
    		px,
    		pt,
    		pb,
    		pl,
    		pr,
    		forwardEvents,
    		castRoot,
    		theme,
    		getCSSStyles,
    		isHTMLElement,
    		isComponent,
    		systemStyles,
    		BoxStyles
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('css' in $$props) $$invalidate(13, css$1 = $$new_props.css);
    		if ('root' in $$props) $$invalidate(3, root = $$new_props.root);
    		if ('m' in $$props) $$invalidate(14, m = $$new_props.m);
    		if ('my' in $$props) $$invalidate(15, my = $$new_props.my);
    		if ('mx' in $$props) $$invalidate(16, mx = $$new_props.mx);
    		if ('mt' in $$props) $$invalidate(17, mt = $$new_props.mt);
    		if ('mb' in $$props) $$invalidate(18, mb = $$new_props.mb);
    		if ('ml' in $$props) $$invalidate(19, ml = $$new_props.ml);
    		if ('mr' in $$props) $$invalidate(20, mr = $$new_props.mr);
    		if ('p' in $$props) $$invalidate(21, p = $$new_props.p);
    		if ('py' in $$props) $$invalidate(22, py = $$new_props.py);
    		if ('px' in $$props) $$invalidate(23, px = $$new_props.px);
    		if ('pt' in $$props) $$invalidate(24, pt = $$new_props.pt);
    		if ('pb' in $$props) $$invalidate(25, pb = $$new_props.pb);
    		if ('pl' in $$props) $$invalidate(26, pl = $$new_props.pl);
    		if ('pr' in $$props) $$invalidate(27, pr = $$new_props.pr);
    		if ('isHTMLElement' in $$props) $$invalidate(4, isHTMLElement = $$new_props.isHTMLElement);
    		if ('isComponent' in $$props) $$invalidate(5, isComponent = $$new_props.isComponent);
    		if ('systemStyles' in $$props) $$invalidate(6, systemStyles = $$new_props.systemStyles);
    		if ('BoxStyles' in $$props) $$invalidate(7, BoxStyles = $$new_props.BoxStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*root*/ 8) {
    			{
    				$$invalidate(4, isHTMLElement = root && typeof root === 'string');
    				$$invalidate(5, isComponent = root && typeof root === 'function');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*m, my, mx, mt, mb, ml, mr, p, py, px, pt, pb, pl, pr*/ 268419072) {
    			$$invalidate(6, systemStyles = getSystemStyles(
    				{
    					m,
    					my,
    					mx,
    					mt,
    					mb,
    					ml,
    					mr,
    					p,
    					py,
    					px,
    					pt,
    					pb,
    					pl,
    					pr
    				},
    				theme
    			));
    		}
    	};

    	$$invalidate(7, BoxStyles = css({}));

    	return [
    		element,
    		use,
    		className,
    		root,
    		isHTMLElement,
    		isComponent,
    		systemStyles,
    		BoxStyles,
    		forwardEvents,
    		castRoot,
    		theme,
    		getCSSStyles,
    		$$restProps,
    		css$1,
    		m,
    		my,
    		mx,
    		mt,
    		mb,
    		ml,
    		mr,
    		p,
    		py,
    		px,
    		pt,
    		pb,
    		pl,
    		pr,
    		slots,
    		svelte_element_binding,
    		switch_instance_binding,
    		div_binding,
    		$$scope
    	];
    }

    class Box extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$o,
    			create_fragment$p,
    			safe_not_equal,
    			{
    				use: 1,
    				element: 0,
    				class: 2,
    				css: 13,
    				root: 3,
    				m: 14,
    				my: 15,
    				mx: 16,
    				mt: 17,
    				mb: 18,
    				ml: 19,
    				mr: 20,
    				p: 21,
    				py: 22,
    				px: 23,
    				pt: 24,
    				pb: 25,
    				pl: 26,
    				pr: 27
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Box",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get use() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get root() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set root(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get m() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set m(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get my() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set my(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mx() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mx(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mt() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mt(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mb() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mb(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ml() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ml(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mr() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mr(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get p() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set p(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get py() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set py(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get px() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set px(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pt() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pt(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pb() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pb(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pl() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pl(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pr() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pr(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Box$1 = Box;

    /* node_modules/@svelteuidev/core/components/Loader/loaders/Circle.svelte generated by Svelte v3.55.1 */
    const file$g = "node_modules/@svelteuidev/core/components/Loader/loaders/Circle.svelte";

    function create_fragment$o(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let circle;
    	let path;
    	let animateTransform;
    	let svg_width_value;
    	let svg_height_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			circle = svg_element("circle");
    			path = svg_element("path");
    			animateTransform = svg_element("animateTransform");
    			attr_dev(circle, "stroke-opacity", ".5");
    			attr_dev(circle, "cx", "16");
    			attr_dev(circle, "cy", "16");
    			attr_dev(circle, "r", "16");
    			add_location(circle, file$g, 19, 3, 453);
    			attr_dev(animateTransform, "attributeName", "transform");
    			attr_dev(animateTransform, "type", "rotate");
    			attr_dev(animateTransform, "from", "0 16 16");
    			attr_dev(animateTransform, "to", "360 16 16");
    			attr_dev(animateTransform, "dur", "1s");
    			attr_dev(animateTransform, "repeatCount", "indefinite");
    			add_location(animateTransform, file$g, 21, 4, 553);
    			attr_dev(path, "d", "M32 16c0-9.94-8.06-16-16-16");
    			add_location(path, file$g, 20, 3, 510);
    			attr_dev(g0, "transform", "translate(2.5 2.5)");
    			attr_dev(g0, "stroke-width", "5");
    			add_location(g0, file$g, 18, 2, 398);
    			attr_dev(g1, "fill", "none");
    			attr_dev(g1, "fill-rule", "evenodd");
    			add_location(g1, file$g, 17, 1, 360);
    			attr_dev(svg, "width", svg_width_value = `${/*size*/ ctx[1]}px`);
    			attr_dev(svg, "height", svg_height_value = `${/*size*/ ctx[1]}px`);
    			attr_dev(svg, "viewBox", "0 0 38 38");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "stroke", /*color*/ ctx[2]);
    			attr_dev(svg, "class", /*className*/ ctx[3]);
    			add_location(svg, file$g, 8, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, circle);
    			append_dev(g0, path);
    			append_dev(path, animateTransform);

    			if (!mounted) {
    				dispose = action_destroyer(useActions_action = useActions$1.call(null, svg, /*use*/ ctx[0]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 2 && svg_width_value !== (svg_width_value = `${/*size*/ ctx[1]}px`)) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty & /*size*/ 2 && svg_height_value !== (svg_height_value = `${/*size*/ ctx[1]}px`)) {
    				attr_dev(svg, "height", svg_height_value);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "stroke", /*color*/ ctx[2]);
    			}

    			if (dirty & /*className*/ 8) {
    				attr_dev(svg, "class", /*className*/ ctx[3]);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Circle', slots, []);
    	let { use = [] } = $$props;
    	let { size = 25 } = $$props;
    	let { color = 'blue' } = $$props;
    	let { class: className = '' } = $$props;
    	const writable_props = ['use', 'size', 'color', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Circle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('class' in $$props) $$invalidate(3, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ useActions: useActions$1, use, size, color, className });

    	$$self.$inject_state = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [use, size, color, className];
    }

    class Circle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$o, safe_not_equal, { use: 0, size: 1, color: 2, class: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Circle",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get use() {
    		throw new Error("<Circle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Circle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Circle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Circle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Circle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Circle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Circle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Circle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Circle$1 = Circle;

    /* node_modules/@svelteuidev/core/components/Loader/loaders/Bars.svelte generated by Svelte v3.55.1 */
    const file$f = "node_modules/@svelteuidev/core/components/Loader/loaders/Bars.svelte";

    function create_fragment$n(ctx) {
    	let svg;
    	let rect0;
    	let animate0;
    	let animate1;
    	let rect1;
    	let animate2;
    	let animate3;
    	let rect2;
    	let animate4;
    	let animate5;
    	let rect3;
    	let animate6;
    	let animate7;
    	let rect4;
    	let animate8;
    	let animate9;
    	let svg_width_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			rect0 = svg_element("rect");
    			animate0 = svg_element("animate");
    			animate1 = svg_element("animate");
    			rect1 = svg_element("rect");
    			animate2 = svg_element("animate");
    			animate3 = svg_element("animate");
    			rect2 = svg_element("rect");
    			animate4 = svg_element("animate");
    			animate5 = svg_element("animate");
    			rect3 = svg_element("rect");
    			animate6 = svg_element("animate");
    			animate7 = svg_element("animate");
    			rect4 = svg_element("rect");
    			animate8 = svg_element("animate");
    			animate9 = svg_element("animate");
    			attr_dev(animate0, "attributeName", "height");
    			attr_dev(animate0, "begin", "0.5s");
    			attr_dev(animate0, "dur", "1s");
    			attr_dev(animate0, "values", "120;110;100;90;80;70;60;50;40;140;120");
    			attr_dev(animate0, "calcMode", "linear");
    			attr_dev(animate0, "repeatCount", "indefinite");
    			add_location(animate0, file$f, 17, 2, 385);
    			attr_dev(animate1, "attributeName", "y");
    			attr_dev(animate1, "begin", "0.5s");
    			attr_dev(animate1, "dur", "1s");
    			attr_dev(animate1, "values", "10;15;20;25;30;35;40;45;50;0;10");
    			attr_dev(animate1, "calcMode", "linear");
    			attr_dev(animate1, "repeatCount", "indefinite");
    			add_location(animate1, file$f, 25, 2, 554);
    			attr_dev(rect0, "y", "10");
    			attr_dev(rect0, "width", "15");
    			attr_dev(rect0, "height", "120");
    			attr_dev(rect0, "rx", "6");
    			add_location(rect0, file$f, 16, 1, 338);
    			attr_dev(animate2, "attributeName", "height");
    			attr_dev(animate2, "begin", "0.25s");
    			attr_dev(animate2, "dur", "1s");
    			attr_dev(animate2, "values", "120;110;100;90;80;70;60;50;40;140;120");
    			attr_dev(animate2, "calcMode", "linear");
    			attr_dev(animate2, "repeatCount", "indefinite");
    			add_location(animate2, file$f, 35, 2, 774);
    			attr_dev(animate3, "attributeName", "y");
    			attr_dev(animate3, "begin", "0.25s");
    			attr_dev(animate3, "dur", "1s");
    			attr_dev(animate3, "values", "10;15;20;25;30;35;40;45;50;0;10");
    			attr_dev(animate3, "calcMode", "linear");
    			attr_dev(animate3, "repeatCount", "indefinite");
    			add_location(animate3, file$f, 43, 2, 944);
    			attr_dev(rect1, "x", "30");
    			attr_dev(rect1, "y", "10");
    			attr_dev(rect1, "width", "15");
    			attr_dev(rect1, "height", "120");
    			attr_dev(rect1, "rx", "6");
    			add_location(rect1, file$f, 34, 1, 720);
    			attr_dev(animate4, "attributeName", "height");
    			attr_dev(animate4, "begin", "0s");
    			attr_dev(animate4, "dur", "1s");
    			attr_dev(animate4, "values", "120;110;100;90;80;70;60;50;40;140;120");
    			attr_dev(animate4, "calcMode", "linear");
    			attr_dev(animate4, "repeatCount", "indefinite");
    			add_location(animate4, file$f, 53, 2, 1158);
    			attr_dev(animate5, "attributeName", "y");
    			attr_dev(animate5, "begin", "0s");
    			attr_dev(animate5, "dur", "1s");
    			attr_dev(animate5, "values", "10;15;20;25;30;35;40;45;50;0;10");
    			attr_dev(animate5, "calcMode", "linear");
    			attr_dev(animate5, "repeatCount", "indefinite");
    			add_location(animate5, file$f, 61, 2, 1325);
    			attr_dev(rect2, "x", "60");
    			attr_dev(rect2, "width", "15");
    			attr_dev(rect2, "height", "140");
    			attr_dev(rect2, "rx", "6");
    			add_location(rect2, file$f, 52, 1, 1111);
    			attr_dev(animate6, "attributeName", "height");
    			attr_dev(animate6, "begin", "0.25s");
    			attr_dev(animate6, "dur", "1s");
    			attr_dev(animate6, "values", "120;110;100;90;80;70;60;50;40;140;120");
    			attr_dev(animate6, "calcMode", "linear");
    			attr_dev(animate6, "repeatCount", "indefinite");
    			add_location(animate6, file$f, 71, 2, 1543);
    			attr_dev(animate7, "attributeName", "y");
    			attr_dev(animate7, "begin", "0.25s");
    			attr_dev(animate7, "dur", "1s");
    			attr_dev(animate7, "values", "10;15;20;25;30;35;40;45;50;0;10");
    			attr_dev(animate7, "calcMode", "linear");
    			attr_dev(animate7, "repeatCount", "indefinite");
    			add_location(animate7, file$f, 79, 2, 1713);
    			attr_dev(rect3, "x", "90");
    			attr_dev(rect3, "y", "10");
    			attr_dev(rect3, "width", "15");
    			attr_dev(rect3, "height", "120");
    			attr_dev(rect3, "rx", "6");
    			add_location(rect3, file$f, 70, 1, 1489);
    			attr_dev(animate8, "attributeName", "height");
    			attr_dev(animate8, "begin", "0.5s");
    			attr_dev(animate8, "dur", "1s");
    			attr_dev(animate8, "values", "120;110;100;90;80;70;60;50;40;140;120");
    			attr_dev(animate8, "calcMode", "linear");
    			attr_dev(animate8, "repeatCount", "indefinite");
    			add_location(animate8, file$f, 89, 2, 1935);
    			attr_dev(animate9, "attributeName", "y");
    			attr_dev(animate9, "begin", "0.5s");
    			attr_dev(animate9, "dur", "1s");
    			attr_dev(animate9, "values", "10;15;20;25;30;35;40;45;50;0;10");
    			attr_dev(animate9, "calcMode", "linear");
    			attr_dev(animate9, "repeatCount", "indefinite");
    			add_location(animate9, file$f, 97, 2, 2104);
    			attr_dev(rect4, "x", "120");
    			attr_dev(rect4, "y", "10");
    			attr_dev(rect4, "width", "15");
    			attr_dev(rect4, "height", "120");
    			attr_dev(rect4, "rx", "6");
    			add_location(rect4, file$f, 88, 1, 1880);
    			attr_dev(svg, "viewBox", "0 0 135 140");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", /*color*/ ctx[2]);
    			attr_dev(svg, "width", svg_width_value = `${/*size*/ ctx[1]}px`);
    			attr_dev(svg, "class", /*className*/ ctx[3]);
    			add_location(svg, file$f, 8, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, rect0);
    			append_dev(rect0, animate0);
    			append_dev(rect0, animate1);
    			append_dev(svg, rect1);
    			append_dev(rect1, animate2);
    			append_dev(rect1, animate3);
    			append_dev(svg, rect2);
    			append_dev(rect2, animate4);
    			append_dev(rect2, animate5);
    			append_dev(svg, rect3);
    			append_dev(rect3, animate6);
    			append_dev(rect3, animate7);
    			append_dev(svg, rect4);
    			append_dev(rect4, animate8);
    			append_dev(rect4, animate9);

    			if (!mounted) {
    				dispose = action_destroyer(useActions_action = useActions$1.call(null, svg, /*use*/ ctx[0]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*size*/ 2 && svg_width_value !== (svg_width_value = `${/*size*/ ctx[1]}px`)) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty & /*className*/ 8) {
    				attr_dev(svg, "class", /*className*/ ctx[3]);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bars', slots, []);
    	let { use = [] } = $$props;
    	let { size = 25 } = $$props;
    	let { color = 'blue' } = $$props;
    	let { class: className = '' } = $$props;
    	const writable_props = ['use', 'size', 'color', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bars> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('class' in $$props) $$invalidate(3, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ useActions: useActions$1, use, size, color, className });

    	$$self.$inject_state = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [use, size, color, className];
    }

    class Bars extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$n, safe_not_equal, { use: 0, size: 1, color: 2, class: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bars",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get use() {
    		throw new Error("<Bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Bars$1 = Bars;

    /* node_modules/@svelteuidev/core/components/Loader/loaders/Dots.svelte generated by Svelte v3.55.1 */
    const file$e = "node_modules/@svelteuidev/core/components/Loader/loaders/Dots.svelte";

    function create_fragment$m(ctx) {
    	let svg;
    	let circle0;
    	let animate0;
    	let animate1;
    	let circle1;
    	let animate2;
    	let animate3;
    	let circle2;
    	let animate4;
    	let animate5;
    	let svg_width_value;
    	let svg_height_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			animate0 = svg_element("animate");
    			animate1 = svg_element("animate");
    			circle1 = svg_element("circle");
    			animate2 = svg_element("animate");
    			animate3 = svg_element("animate");
    			circle2 = svg_element("circle");
    			animate4 = svg_element("animate");
    			animate5 = svg_element("animate");
    			attr_dev(animate0, "attributeName", "r");
    			attr_dev(animate0, "from", "15");
    			attr_dev(animate0, "to", "15");
    			attr_dev(animate0, "begin", "0s");
    			attr_dev(animate0, "dur", "0.8s");
    			attr_dev(animate0, "values", "15;9;15");
    			attr_dev(animate0, "calcMode", "linear");
    			attr_dev(animate0, "repeatCount", "indefinite");
    			add_location(animate0, file$e, 18, 2, 405);
    			attr_dev(animate1, "attributeName", "fill-opacity");
    			attr_dev(animate1, "from", "1");
    			attr_dev(animate1, "to", "1");
    			attr_dev(animate1, "begin", "0s");
    			attr_dev(animate1, "dur", "0.8s");
    			attr_dev(animate1, "values", "1;.5;1");
    			attr_dev(animate1, "calcMode", "linear");
    			attr_dev(animate1, "repeatCount", "indefinite");
    			add_location(animate1, file$e, 28, 2, 563);
    			attr_dev(circle0, "cx", "15");
    			attr_dev(circle0, "cy", "15");
    			attr_dev(circle0, "r", "15");
    			add_location(circle0, file$e, 17, 1, 371);
    			attr_dev(animate2, "attributeName", "r");
    			attr_dev(animate2, "from", "9");
    			attr_dev(animate2, "to", "9");
    			attr_dev(animate2, "begin", "0s");
    			attr_dev(animate2, "dur", "0.8s");
    			attr_dev(animate2, "values", "9;15;9");
    			attr_dev(animate2, "calcMode", "linear");
    			attr_dev(animate2, "repeatCount", "indefinite");
    			add_location(animate2, file$e, 40, 2, 791);
    			attr_dev(animate3, "attributeName", "fill-opacity");
    			attr_dev(animate3, "from", "0.5");
    			attr_dev(animate3, "to", "0.5");
    			attr_dev(animate3, "begin", "0s");
    			attr_dev(animate3, "dur", "0.8s");
    			attr_dev(animate3, "values", ".5;1;.5");
    			attr_dev(animate3, "calcMode", "linear");
    			attr_dev(animate3, "repeatCount", "indefinite");
    			add_location(animate3, file$e, 50, 2, 946);
    			attr_dev(circle1, "cx", "60");
    			attr_dev(circle1, "cy", "15");
    			attr_dev(circle1, "r", "9");
    			attr_dev(circle1, "fill-opacity", "0.3");
    			add_location(circle1, file$e, 39, 1, 739);
    			attr_dev(animate4, "attributeName", "r");
    			attr_dev(animate4, "from", "15");
    			attr_dev(animate4, "to", "15");
    			attr_dev(animate4, "begin", "0s");
    			attr_dev(animate4, "dur", "0.8s");
    			attr_dev(animate4, "values", "15;9;15");
    			attr_dev(animate4, "calcMode", "linear");
    			attr_dev(animate4, "repeatCount", "indefinite");
    			add_location(animate4, file$e, 62, 2, 1162);
    			attr_dev(animate5, "attributeName", "fill-opacity");
    			attr_dev(animate5, "from", "1");
    			attr_dev(animate5, "to", "1");
    			attr_dev(animate5, "begin", "0s");
    			attr_dev(animate5, "dur", "0.8s");
    			attr_dev(animate5, "values", "1;.5;1");
    			attr_dev(animate5, "calcMode", "linear");
    			attr_dev(animate5, "repeatCount", "indefinite");
    			add_location(animate5, file$e, 72, 2, 1320);
    			attr_dev(circle2, "cx", "105");
    			attr_dev(circle2, "cy", "15");
    			attr_dev(circle2, "r", "15");
    			add_location(circle2, file$e, 61, 1, 1127);
    			attr_dev(svg, "width", svg_width_value = `${/*size*/ ctx[1]}px`);
    			attr_dev(svg, "height", svg_height_value = `${Number(/*size*/ ctx[1]) / 4}px`);
    			attr_dev(svg, "viewBox", "0 0 120 30");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", /*color*/ ctx[2]);
    			attr_dev(svg, "class", /*className*/ ctx[3]);
    			add_location(svg, file$e, 8, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle0);
    			append_dev(circle0, animate0);
    			append_dev(circle0, animate1);
    			append_dev(svg, circle1);
    			append_dev(circle1, animate2);
    			append_dev(circle1, animate3);
    			append_dev(svg, circle2);
    			append_dev(circle2, animate4);
    			append_dev(circle2, animate5);

    			if (!mounted) {
    				dispose = action_destroyer(useActions_action = useActions$1.call(null, svg, /*use*/ ctx[0]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 2 && svg_width_value !== (svg_width_value = `${/*size*/ ctx[1]}px`)) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty & /*size*/ 2 && svg_height_value !== (svg_height_value = `${Number(/*size*/ ctx[1]) / 4}px`)) {
    				attr_dev(svg, "height", svg_height_value);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*className*/ 8) {
    				attr_dev(svg, "class", /*className*/ ctx[3]);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dots', slots, []);
    	let { use = [] } = $$props;
    	let { size = 25 } = $$props;
    	let { color = 'blue' } = $$props;
    	let { class: className = '' } = $$props;
    	const writable_props = ['use', 'size', 'color', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dots> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('class' in $$props) $$invalidate(3, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ useActions: useActions$1, use, size, color, className });

    	$$self.$inject_state = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [use, size, color, className];
    }

    class Dots$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$m, safe_not_equal, { use: 0, size: 1, color: 2, class: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dots",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get use() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Dots$2 = Dots$1;

    const LOADER_SIZES = {
        xs: 18,
        sm: 22,
        md: 36,
        lg: 44,
        xl: 58
    };
    const getCorrectShade = (color, dark = false) => {
        return theme$1.colors[dark ? `${color}400` : `${color}600`].value;
    };

    /* node_modules/@svelteuidev/core/components/Loader/Loader.svelte generated by Svelte v3.55.1 */

    function create_fragment$l(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[5], [useActions$1, /*use*/ ctx[1]]]
    		},
    		{
    			color: /*color*/ ctx[4] === 'white'
    			? 'white'
    			: getCorrectShade(/*color*/ ctx[4])
    		},
    		{ size: LOADER_SIZES[/*size*/ ctx[3]] },
    		{ class: /*className*/ ctx[2] },
    		/*$$restProps*/ ctx[8]
    	];

    	var switch_value = /*LOADERS*/ ctx[6][/*defaultLoader*/ ctx[7]];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		/*switch_instance_binding*/ ctx[10](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, useActions, use, color, getCorrectShade, LOADER_SIZES, size, className, $$restProps*/ 318)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, useActions, use*/ 34 && {
    						use: [/*forwardEvents*/ ctx[5], [useActions$1, /*use*/ ctx[1]]]
    					},
    					dirty & /*color, getCorrectShade*/ 16 && {
    						color: /*color*/ ctx[4] === 'white'
    						? 'white'
    						: getCorrectShade(/*color*/ ctx[4])
    					},
    					dirty & /*LOADER_SIZES, size*/ 8 && { size: LOADER_SIZES[/*size*/ ctx[3]] },
    					dirty & /*className*/ 4 && { class: /*className*/ ctx[2] },
    					dirty & /*$$restProps*/ 256 && get_spread_object(/*$$restProps*/ ctx[8])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*LOADERS*/ ctx[6][/*defaultLoader*/ ctx[7]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					/*switch_instance_binding*/ ctx[10](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[10](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","element","class","size","color","variant"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	let { use = [], element = undefined, class: className = '', size = 'md', color = 'blue', variant = 'circle' } = $$props;

    	/** An action that forwards inner dom node events from parent component */
    	const forwardEvents = createEventForwarder(get_current_component());

    	/** Loader logic */
    	const LOADERS = { bars: Bars$1, circle: Circle$1, dots: Dots$2 };

    	const defaultLoader = variant in LOADERS ? variant : 'circle';

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('size' in $$new_props) $$invalidate(3, size = $$new_props.size);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('variant' in $$new_props) $$invalidate(9, variant = $$new_props.variant);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		useActions: useActions$1,
    		Circle: Circle$1,
    		Bars: Bars$1,
    		Dots: Dots$2,
    		LOADER_SIZES,
    		getCorrectShade,
    		use,
    		element,
    		className,
    		size,
    		color,
    		variant,
    		forwardEvents,
    		LOADERS,
    		defaultLoader
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('size' in $$props) $$invalidate(3, size = $$new_props.size);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('variant' in $$props) $$invalidate(9, variant = $$new_props.variant);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		use,
    		className,
    		size,
    		color,
    		forwardEvents,
    		LOADERS,
    		defaultLoader,
    		$$restProps,
    		variant,
    		switch_instance_binding
    	];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$l, safe_not_equal, {
    			use: 1,
    			element: 0,
    			class: 2,
    			size: 3,
    			color: 4,
    			variant: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get use() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Loader$1 = Loader;

    /* node_modules/@svelteuidev/core/components/ActionIcon/ActionIcon.svelte generated by Svelte v3.55.1 */

    const { Error: Error_1$2 } = globals;

    // (58:1) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(58:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:1) {#if loading}
    function create_if_block$4(ctx) {
    	let loader;
    	let current;

    	loader = new Loader$1({
    			props: {
    				size: /*loaderProps*/ ctx[6].size,
    				color: /*loaderProps*/ ctx[6].color,
    				variant: /*loaderProps*/ ctx[6].variant
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loader_changes = {};
    			if (dirty & /*loaderProps*/ 64) loader_changes.size = /*loaderProps*/ ctx[6].size;
    			if (dirty & /*loaderProps*/ 64) loader_changes.color = /*loaderProps*/ ctx[6].color;
    			if (dirty & /*loaderProps*/ 64) loader_changes.variant = /*loaderProps*/ ctx[6].variant;
    			loader.$set(loader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(56:1) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (59:8) +
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("+");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(59:8) +",
    		ctx
    	});

    	return block;
    }

    // (44:0) <Box  bind:element  use={[forwardEvents, [useActions, use]]}  tabindex={0}  disabled={disabled || loading}  class={cx(className, { loading, disabled }, getStyles({ css: override, variation: variant }))}  target={external ? '_blank' : null}  rel={external ? 'noreferrer noopener' : null}  {root}  {href}  {...$$restProps} >
    function create_default_slot$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(44:0) <Box  bind:element  use={[forwardEvents, [useActions, use]]}  tabindex={0}  disabled={disabled || loading}  class={cx(className, { loading, disabled }, getStyles({ css: override, variation: variant }))}  target={external ? '_blank' : null}  rel={external ? 'noreferrer noopener' : null}  {root}  {href}  {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let error;
    	let t;
    	let box;
    	let updating_element;
    	let current;

    	error = new Error$2({
    			props: {
    				observable: /*observable*/ ctx[11],
    				component: "ActionIcon",
    				code: /*err*/ ctx[12]
    			},
    			$$inline: true
    		});

    	const box_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[15], [useActions$1, /*use*/ ctx[2]]]
    		},
    		{ tabindex: 0 },
    		{
    			disabled: /*disabled*/ ctx[8] || /*loading*/ ctx[7]
    		},
    		{
    			class: /*cx*/ ctx[14](
    				/*className*/ ctx[3],
    				{
    					loading: /*loading*/ ctx[7],
    					disabled: /*disabled*/ ctx[8]
    				},
    				/*getStyles*/ ctx[13]({
    					css: /*override*/ ctx[1],
    					variation: /*variant*/ ctx[5]
    				})
    			)
    		},
    		{
    			target: /*external*/ ctx[10] ? '_blank' : null
    		},
    		{
    			rel: /*external*/ ctx[10] ? 'noreferrer noopener' : null
    		},
    		{ root: /*root*/ ctx[4] },
    		{ href: /*href*/ ctx[9] },
    		/*$$restProps*/ ctx[16]
    	];

    	function box_element_binding(value) {
    		/*box_element_binding*/ ctx[21](value);
    	}

    	let box_props = {
    		$$slots: { default: [create_default_slot$9] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < box_spread_levels.length; i += 1) {
    		box_props = assign(box_props, box_spread_levels[i]);
    	}

    	if (/*element*/ ctx[0] !== void 0) {
    		box_props.element = /*element*/ ctx[0];
    	}

    	box = new Box$1({ props: box_props, $$inline: true });
    	binding_callbacks.push(() => bind(box, 'element', box_element_binding));

    	const block = {
    		c: function create() {
    			create_component(error.$$.fragment);
    			t = space();
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$2("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(error, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const error_changes = {};
    			if (dirty & /*observable*/ 2048) error_changes.observable = /*observable*/ ctx[11];
    			if (dirty & /*err*/ 4096) error_changes.code = /*err*/ ctx[12];
    			error.$set(error_changes);

    			const box_changes = (dirty & /*forwardEvents, useActions, use, disabled, loading, cx, className, getStyles, override, variant, external, root, href, $$restProps*/ 124862)
    			? get_spread_update(box_spread_levels, [
    					dirty & /*forwardEvents, useActions, use*/ 32772 && {
    						use: [/*forwardEvents*/ ctx[15], [useActions$1, /*use*/ ctx[2]]]
    					},
    					box_spread_levels[1],
    					dirty & /*disabled, loading*/ 384 && {
    						disabled: /*disabled*/ ctx[8] || /*loading*/ ctx[7]
    					},
    					dirty & /*cx, className, loading, disabled, getStyles, override, variant*/ 25002 && {
    						class: /*cx*/ ctx[14](
    							/*className*/ ctx[3],
    							{
    								loading: /*loading*/ ctx[7],
    								disabled: /*disabled*/ ctx[8]
    							},
    							/*getStyles*/ ctx[13]({
    								css: /*override*/ ctx[1],
    								variation: /*variant*/ ctx[5]
    							})
    						)
    					},
    					dirty & /*external*/ 1024 && {
    						target: /*external*/ ctx[10] ? '_blank' : null
    					},
    					dirty & /*external*/ 1024 && {
    						rel: /*external*/ ctx[10] ? 'noreferrer noopener' : null
    					},
    					dirty & /*root*/ 16 && { root: /*root*/ ctx[4] },
    					dirty & /*href*/ 512 && { href: /*href*/ ctx[9] },
    					dirty & /*$$restProps*/ 65536 && get_spread_object(/*$$restProps*/ ctx[16])
    				])
    			: {};

    			if (dirty & /*$$scope, loaderProps, loading*/ 4194496) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*element*/ 1) {
    				updating_element = true;
    				box_changes.element = /*element*/ ctx[0];
    				add_flush_callback(() => updating_element = false);
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(error.$$.fragment, local);
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(error.$$.fragment, local);
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(error, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let cx;
    	let getStyles;

    	const omit_props_names = [
    		"use","element","class","override","root","color","variant","size","radius","loaderProps","loading","disabled","href","external"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ActionIcon', slots, ['default']);

    	let { use = [], element = undefined, class: className = '', override = {}, root = 'button', color = 'gray', variant = 'hover', size = 'md', radius = 'sm', loaderProps = {
    		size: 'xs',
    		color: 'gray',
    		variant: 'circle'
    	}, loading = false, disabled = false, href = '', external = false } = $$props;

    	const forwardEvents = createEventForwarder(get_current_component());

    	// --------------Error Handling-------------------
    	let observable = false;

    	let err;

    	if (root !== 'a' && $$props.href) {
    		observable = true;
    		err = ActionIconErrors[0];
    	}

    	function box_element_binding(value) {
    		element = value;
    		$$invalidate(0, element);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(2, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('override' in $$new_props) $$invalidate(1, override = $$new_props.override);
    		if ('root' in $$new_props) $$invalidate(4, root = $$new_props.root);
    		if ('color' in $$new_props) $$invalidate(17, color = $$new_props.color);
    		if ('variant' in $$new_props) $$invalidate(5, variant = $$new_props.variant);
    		if ('size' in $$new_props) $$invalidate(18, size = $$new_props.size);
    		if ('radius' in $$new_props) $$invalidate(19, radius = $$new_props.radius);
    		if ('loaderProps' in $$new_props) $$invalidate(6, loaderProps = $$new_props.loaderProps);
    		if ('loading' in $$new_props) $$invalidate(7, loading = $$new_props.loading);
    		if ('disabled' in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(9, href = $$new_props.href);
    		if ('external' in $$new_props) $$invalidate(10, external = $$new_props.external);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		useStyles: useStyles$7,
    		ActionIconErrors,
    		createEventForwarder,
    		useActions: useActions$1,
    		get_current_component,
    		Box: Box$1,
    		Loader: Loader$1,
    		Error: Error$2,
    		use,
    		element,
    		className,
    		override,
    		root,
    		color,
    		variant,
    		size,
    		radius,
    		loaderProps,
    		loading,
    		disabled,
    		href,
    		external,
    		forwardEvents,
    		observable,
    		err,
    		getStyles,
    		cx
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('use' in $$props) $$invalidate(2, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('override' in $$props) $$invalidate(1, override = $$new_props.override);
    		if ('root' in $$props) $$invalidate(4, root = $$new_props.root);
    		if ('color' in $$props) $$invalidate(17, color = $$new_props.color);
    		if ('variant' in $$props) $$invalidate(5, variant = $$new_props.variant);
    		if ('size' in $$props) $$invalidate(18, size = $$new_props.size);
    		if ('radius' in $$props) $$invalidate(19, radius = $$new_props.radius);
    		if ('loaderProps' in $$props) $$invalidate(6, loaderProps = $$new_props.loaderProps);
    		if ('loading' in $$props) $$invalidate(7, loading = $$new_props.loading);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(9, href = $$new_props.href);
    		if ('external' in $$props) $$invalidate(10, external = $$new_props.external);
    		if ('observable' in $$props) $$invalidate(11, observable = $$new_props.observable);
    		if ('err' in $$props) $$invalidate(12, err = $$new_props.err);
    		if ('getStyles' in $$props) $$invalidate(13, getStyles = $$new_props.getStyles);
    		if ('cx' in $$props) $$invalidate(14, cx = $$new_props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*observable*/ 2048) {
    			if (observable) $$invalidate(1, override = { display: 'none' });
    		}

    		if ($$self.$$.dirty & /*color, radius, size, variant*/ 917536) {
    			// --------------End Error Handling-------------------
    			$$invalidate(14, { cx, getStyles } = useStyles$7({ color, radius, size, variant }, { name: 'ActionIcon' }), cx, (((($$invalidate(13, getStyles), $$invalidate(17, color)), $$invalidate(19, radius)), $$invalidate(18, size)), $$invalidate(5, variant)));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		override,
    		use,
    		className,
    		root,
    		variant,
    		loaderProps,
    		loading,
    		disabled,
    		href,
    		external,
    		observable,
    		err,
    		getStyles,
    		cx,
    		forwardEvents,
    		$$restProps,
    		color,
    		size,
    		radius,
    		slots,
    		box_element_binding,
    		$$scope
    	];
    }

    class ActionIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$k, safe_not_equal, {
    			use: 2,
    			element: 0,
    			class: 3,
    			override: 1,
    			root: 4,
    			color: 17,
    			variant: 5,
    			size: 18,
    			radius: 19,
    			loaderProps: 6,
    			loading: 7,
    			disabled: 8,
    			href: 9,
    			external: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActionIcon",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get use() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get root() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set root(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loaderProps() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loaderProps(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get external() {
    		throw new Error_1$2("<ActionIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set external(value) {
    		throw new Error_1$2("<ActionIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ActionIcon$1 = ActionIcon;

    function getTextColor(color, variant, gradient, dark = false) {
        if (color === 'dimmed')
            return dark ? '$dark200' : '$gray600';
        if (variant === 'gradient' || gradient)
            return `$${color}600`;
        if (variant === 'link')
            return dark ? `$blue400` : `$blue700`;
        if (variant === 'text')
            return dark ? `$${color}500` : `$${color}700`;
    }
    var useStyles$6 = createStyles((theme, { align, color, inherit, inline, lineClamp, size, tracking, transform, underline, weight, gradient, variant }) => {
        return {
            root: {
                focusRing: 'auto',
                [`${theme.dark} &`]: {
                    color: color === 'dark' ? '$dark50' : getTextColor(color, variant, gradient, true)
                },
                fontFamily: inherit ? 'inherit' : '$standard',
                fontSize: inherit ? 'inherit' : typeof size === 'string' ? `$${size}` : `${size}px`,
                fontWeight: inherit ? 'inherit' : `$${weight}`,
                letterSpacing: theme.letterSpacings[tracking]?.value,
                lineHeight: inherit
                    ? 'inherit'
                    : inline
                        ? 1
                        : typeof size === 'string'
                            ? `$${size}`
                            : `${size}px`,
                textTransform: transform,
                textDecoration: underline ? 'underline' : 'none',
                textAlign: align,
                cursor: variant === 'link' ? 'pointer' : 'inherit',
                color: color === 'green' ? 'Black' : getTextColor(color, variant, gradient),
                backgroundImage: variant === 'gradient'
                    ? `linear-gradient(${gradient?.deg}deg, $${gradient?.from}600 0%, $${gradient?.to}600 100%)`
                    : null,
                WebkitBackgroundClip: variant === 'gradient' ? 'text' : null,
                WebkitTextFillColor: variant === 'gradient' ? 'transparent' : null,
                ...(lineClamp !== undefined
                    ? {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: lineClamp,
                        WebkitBoxOrient: 'vertical'
                    }
                    : {}),
                '&:hover': variant === 'link' && underline === true
                    ? {
                        textDecoration: 'underline'
                    }
                    : undefined
            }
        };
    });

    /** Error codes for component Text
     *
     * `Object.freeze` is needed to keep modification outside of the object unavailable
     *
     * ## Code 1:
     * If using the 'gradient' prop, set 'variant' prop to 'gradient' to apply the gradient
     *
     * ## Code 2:
     * If using the 'link' variant, an href needs to be set and the root must be an anchor
     */
    const TextErrors = Object.freeze([
        {
            error: true,
            message: "If using the 'gradient' prop, set 'variant' prop to 'gradient' to apply the gradient",
            solution: `
                If your component looks like this:

                &lt;Text gradient={{from: 'blue', to: 'red', deg: 45}}&gt;Text string &lt;/Text&gt;
                                                                    ^^^ - Try adding prop variant='gradient'
                `
        },
        {
            error: true,
            message: "If using the 'link' variant, an href needs to be set and the root must be an anchor",
            solution: `
                If your component looks like this:

                &lt;Text variant='link'&gt;Text string &lt;/Text&gt;
                                    ^^^ - Try adding props href && root={'a'}'
                `
        }
    ]);

    /* node_modules/@svelteuidev/core/components/Text/Text.svelte generated by Svelte v3.55.1 */

    const { Error: Error_1$1 } = globals;

    // (55:0) <Box  {root}  bind:element  use={[forwardEvents, [useActions, use]]}  class={cx(className, getStyles({ css: override }))}  href={href ?? undefined}  {...$$restProps} >
    function create_default_slot$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[26], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 67108864)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[26], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(55:0) <Box  {root}  bind:element  use={[forwardEvents, [useActions, use]]}  class={cx(className, getStyles({ css: override }))}  href={href ?? undefined}  {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let error;
    	let t;
    	let box;
    	let updating_element;
    	let current;

    	error = new Error$2({
    			props: {
    				observable: /*observable*/ ctx[6],
    				component: "Text",
    				code: /*err*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const box_spread_levels = [
    		{ root: /*root*/ ctx[4] },
    		{
    			use: [/*forwardEvents*/ ctx[10], [useActions$1, /*use*/ ctx[1]]]
    		},
    		{
    			class: /*cx*/ ctx[9](/*className*/ ctx[2], /*getStyles*/ ctx[8]({ css: /*override*/ ctx[3] }))
    		},
    		{ href: /*href*/ ctx[5] ?? undefined },
    		/*$$restProps*/ ctx[11]
    	];

    	function box_element_binding(value) {
    		/*box_element_binding*/ ctx[25](value);
    	}

    	let box_props = {
    		$$slots: { default: [create_default_slot$8] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < box_spread_levels.length; i += 1) {
    		box_props = assign(box_props, box_spread_levels[i]);
    	}

    	if (/*element*/ ctx[0] !== void 0) {
    		box_props.element = /*element*/ ctx[0];
    	}

    	box = new Box$1({ props: box_props, $$inline: true });
    	binding_callbacks.push(() => bind(box, 'element', box_element_binding));

    	const block = {
    		c: function create() {
    			create_component(error.$$.fragment);
    			t = space();
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(error, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const error_changes = {};
    			if (dirty & /*observable*/ 64) error_changes.observable = /*observable*/ ctx[6];
    			if (dirty & /*err*/ 128) error_changes.code = /*err*/ ctx[7];
    			error.$set(error_changes);

    			const box_changes = (dirty & /*root, forwardEvents, useActions, use, cx, className, getStyles, override, href, undefined, $$restProps*/ 3902)
    			? get_spread_update(box_spread_levels, [
    					dirty & /*root*/ 16 && { root: /*root*/ ctx[4] },
    					dirty & /*forwardEvents, useActions, use*/ 1026 && {
    						use: [/*forwardEvents*/ ctx[10], [useActions$1, /*use*/ ctx[1]]]
    					},
    					dirty & /*cx, className, getStyles, override*/ 780 && {
    						class: /*cx*/ ctx[9](/*className*/ ctx[2], /*getStyles*/ ctx[8]({ css: /*override*/ ctx[3] }))
    					},
    					dirty & /*href, undefined*/ 32 && { href: /*href*/ ctx[5] ?? undefined },
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 67108864) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*element*/ 1) {
    				updating_element = true;
    				box_changes.element = /*element*/ ctx[0];
    				add_flush_callback(() => updating_element = false);
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(error.$$.fragment, local);
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(error.$$.fragment, local);
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(error, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let cx;
    	let getStyles;

    	const omit_props_names = [
    		"use","element","class","override","align","color","root","transform","variant","size","weight","gradient","inline","lineClamp","underline","inherit","href","tracking"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, ['default']);
    	let { use = [], element = undefined, class: className = '', override = {}, align = 'left', color = 'dark', root = undefined, transform = 'none', variant = 'text', size = 'md', weight = 'normal', gradient = { from: 'indigo', to: 'cyan', deg: 45 }, inline = true, lineClamp = undefined, underline = false, inherit = false, href = '', tracking = 'normal' } = $$props;

    	/** An action that forwards inner dom node events from parent component */
    	const forwardEvents = createEventForwarder(get_current_component());

    	// --------------Error Handling-------------------
    	let observable = false;

    	let err;

    	if (gradient.from === 'indigo' && gradient.to === 'cyan0' && gradient.deg === 45 && variant !== 'gradient') {
    		observable = true;
    		err = TextErrors[0];
    	}

    	function box_element_binding(value) {
    		element = value;
    		$$invalidate(0, element);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('override' in $$new_props) $$invalidate(3, override = $$new_props.override);
    		if ('align' in $$new_props) $$invalidate(12, align = $$new_props.align);
    		if ('color' in $$new_props) $$invalidate(13, color = $$new_props.color);
    		if ('root' in $$new_props) $$invalidate(4, root = $$new_props.root);
    		if ('transform' in $$new_props) $$invalidate(14, transform = $$new_props.transform);
    		if ('variant' in $$new_props) $$invalidate(15, variant = $$new_props.variant);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('weight' in $$new_props) $$invalidate(17, weight = $$new_props.weight);
    		if ('gradient' in $$new_props) $$invalidate(18, gradient = $$new_props.gradient);
    		if ('inline' in $$new_props) $$invalidate(19, inline = $$new_props.inline);
    		if ('lineClamp' in $$new_props) $$invalidate(20, lineClamp = $$new_props.lineClamp);
    		if ('underline' in $$new_props) $$invalidate(21, underline = $$new_props.underline);
    		if ('inherit' in $$new_props) $$invalidate(22, inherit = $$new_props.inherit);
    		if ('href' in $$new_props) $$invalidate(5, href = $$new_props.href);
    		if ('tracking' in $$new_props) $$invalidate(23, tracking = $$new_props.tracking);
    		if ('$$scope' in $$new_props) $$invalidate(26, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		useActions: useActions$1,
    		Error: Error$2,
    		Box: Box$1,
    		useStyles: useStyles$6,
    		TextErrors,
    		use,
    		element,
    		className,
    		override,
    		align,
    		color,
    		root,
    		transform,
    		variant,
    		size,
    		weight,
    		gradient,
    		inline,
    		lineClamp,
    		underline,
    		inherit,
    		href,
    		tracking,
    		forwardEvents,
    		observable,
    		err,
    		getStyles,
    		cx
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('override' in $$props) $$invalidate(3, override = $$new_props.override);
    		if ('align' in $$props) $$invalidate(12, align = $$new_props.align);
    		if ('color' in $$props) $$invalidate(13, color = $$new_props.color);
    		if ('root' in $$props) $$invalidate(4, root = $$new_props.root);
    		if ('transform' in $$props) $$invalidate(14, transform = $$new_props.transform);
    		if ('variant' in $$props) $$invalidate(15, variant = $$new_props.variant);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('weight' in $$props) $$invalidate(17, weight = $$new_props.weight);
    		if ('gradient' in $$props) $$invalidate(18, gradient = $$new_props.gradient);
    		if ('inline' in $$props) $$invalidate(19, inline = $$new_props.inline);
    		if ('lineClamp' in $$props) $$invalidate(20, lineClamp = $$new_props.lineClamp);
    		if ('underline' in $$props) $$invalidate(21, underline = $$new_props.underline);
    		if ('inherit' in $$props) $$invalidate(22, inherit = $$new_props.inherit);
    		if ('href' in $$props) $$invalidate(5, href = $$new_props.href);
    		if ('tracking' in $$props) $$invalidate(23, tracking = $$new_props.tracking);
    		if ('observable' in $$props) $$invalidate(6, observable = $$new_props.observable);
    		if ('err' in $$props) $$invalidate(7, err = $$new_props.err);
    		if ('getStyles' in $$props) $$invalidate(8, getStyles = $$new_props.getStyles);
    		if ('cx' in $$props) $$invalidate(9, cx = $$new_props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lineClamp, underline, inline, inherit, gradient, variant, align, color, transform, size, weight, tracking*/ 16773120) {
    			// --------------End Error Handling-------------------
    			$$invalidate(
    				9,
    				{ cx, getStyles } = useStyles$6(
    					{
    						lineClamp,
    						underline,
    						inline,
    						inherit,
    						gradient,
    						variant,
    						align,
    						color,
    						transform,
    						size,
    						weight,
    						tracking
    					},
    					{ name: 'Text' }
    				),
    				cx,
    				(((((((((((($$invalidate(8, getStyles), $$invalidate(20, lineClamp)), $$invalidate(21, underline)), $$invalidate(19, inline)), $$invalidate(22, inherit)), $$invalidate(18, gradient)), $$invalidate(15, variant)), $$invalidate(12, align)), $$invalidate(13, color)), $$invalidate(14, transform)), $$invalidate(16, size)), $$invalidate(17, weight)), $$invalidate(23, tracking))
    			);
    		}
    	};

    	return [
    		element,
    		use,
    		className,
    		override,
    		root,
    		href,
    		observable,
    		err,
    		getStyles,
    		cx,
    		forwardEvents,
    		$$restProps,
    		align,
    		color,
    		transform,
    		variant,
    		size,
    		weight,
    		gradient,
    		inline,
    		lineClamp,
    		underline,
    		inherit,
    		tracking,
    		slots,
    		box_element_binding,
    		$$scope
    	];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$j, safe_not_equal, {
    			use: 1,
    			element: 0,
    			class: 2,
    			override: 3,
    			align: 12,
    			color: 13,
    			root: 4,
    			transform: 14,
    			variant: 15,
    			size: 16,
    			weight: 17,
    			gradient: 18,
    			inline: 19,
    			lineClamp: 20,
    			underline: 21,
    			inherit: 22,
    			href: 5,
    			tracking: 23
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get use() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get root() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set root(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transform() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transform(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get weight() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set weight(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gradient() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gradient(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineClamp() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineClamp(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get underline() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set underline(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inherit() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inherit(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tracking() {
    		throw new Error_1$1("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tracking(value) {
    		throw new Error_1$1("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Text$1 = Text;

    var useStyles$5 = createStyles((theme, { radius, shadow, withBorder, padding }) => {
        return {
            root: {
                [`${theme.dark} &`]: {
                    bc: theme.colors['dark700'].value,
                    color: theme.colors['dark50'].value,
                    border: withBorder ? `1px solid ${theme.colors['dark600'].value}` : undefined
                },
                padding: theme.fn.size({ size: padding, sizes: theme.space }),
                outline: 0,
                display: 'block',
                textDecoration: 'none',
                color: 'black',
                backgroundColor: 'white',
                boxSizing: 'border-box',
                borderRadius: `$${radius}`,
                WebkitTapHighlightColor: 'transparent',
                boxShadow: theme.shadows[shadow].value || shadow || 'none',
                border: withBorder ? `1px solid ${theme.colors['gray200'].value}` : undefined
            }
        };
    });

    /* node_modules/@svelteuidev/core/components/Paper/Paper.svelte generated by Svelte v3.55.1 */

    // (8:0) <Box bind:element class={cx(className, getStyles({ css: override }))} {use} {...$$restProps}>
    function create_default_slot$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(8:0) <Box bind:element class={cx(className, getStyles({ css: override }))} {use} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let box;
    	let updating_element;
    	let current;

    	const box_spread_levels = [
    		{
    			class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    		},
    		{ use: /*use*/ ctx[1] },
    		/*$$restProps*/ ctx[6]
    	];

    	function box_element_binding(value) {
    		/*box_element_binding*/ ctx[12](value);
    	}

    	let box_props = {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < box_spread_levels.length; i += 1) {
    		box_props = assign(box_props, box_spread_levels[i]);
    	}

    	if (/*element*/ ctx[0] !== void 0) {
    		box_props.element = /*element*/ ctx[0];
    	}

    	box = new Box$1({ props: box_props, $$inline: true });
    	binding_callbacks.push(() => bind(box, 'element', box_element_binding));

    	const block = {
    		c: function create() {
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const box_changes = (dirty & /*cx, className, getStyles, override, use, $$restProps*/ 126)
    			? get_spread_update(box_spread_levels, [
    					dirty & /*cx, className, getStyles, override*/ 60 && {
    						class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    					},
    					dirty & /*use*/ 2 && { use: /*use*/ ctx[1] },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 8192) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*element*/ 1) {
    				updating_element = true;
    				box_changes.element = /*element*/ ctx[0];
    				add_flush_callback(() => updating_element = false);
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let cx;
    	let getStyles;
    	const omit_props_names = ["use","element","class","override","shadow","radius","withBorder","padding"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paper', slots, ['default']);
    	let { use = [], element = undefined, class: className = '', override = {}, shadow = 'xs', radius = 'sm', withBorder = false, padding = 'md' } = $$props;

    	function box_element_binding(value) {
    		element = value;
    		$$invalidate(0, element);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('override' in $$new_props) $$invalidate(3, override = $$new_props.override);
    		if ('shadow' in $$new_props) $$invalidate(7, shadow = $$new_props.shadow);
    		if ('radius' in $$new_props) $$invalidate(8, radius = $$new_props.radius);
    		if ('withBorder' in $$new_props) $$invalidate(9, withBorder = $$new_props.withBorder);
    		if ('padding' in $$new_props) $$invalidate(10, padding = $$new_props.padding);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		useStyles: useStyles$5,
    		Box: Box$1,
    		use,
    		element,
    		className,
    		override,
    		shadow,
    		radius,
    		withBorder,
    		padding,
    		getStyles,
    		cx
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('override' in $$props) $$invalidate(3, override = $$new_props.override);
    		if ('shadow' in $$props) $$invalidate(7, shadow = $$new_props.shadow);
    		if ('radius' in $$props) $$invalidate(8, radius = $$new_props.radius);
    		if ('withBorder' in $$props) $$invalidate(9, withBorder = $$new_props.withBorder);
    		if ('padding' in $$props) $$invalidate(10, padding = $$new_props.padding);
    		if ('getStyles' in $$props) $$invalidate(4, getStyles = $$new_props.getStyles);
    		if ('cx' in $$props) $$invalidate(5, cx = $$new_props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*radius, shadow, withBorder, padding*/ 1920) {
    			$$invalidate(5, { cx, getStyles } = useStyles$5({ radius, shadow, withBorder, padding }, { name: 'Paper' }), cx, (((($$invalidate(4, getStyles), $$invalidate(8, radius)), $$invalidate(7, shadow)), $$invalidate(9, withBorder)), $$invalidate(10, padding)));
    		}
    	};

    	return [
    		element,
    		use,
    		className,
    		override,
    		getStyles,
    		cx,
    		$$restProps,
    		shadow,
    		radius,
    		withBorder,
    		padding,
    		slots,
    		box_element_binding,
    		$$scope
    	];
    }

    class Paper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$i, safe_not_equal, {
    			use: 1,
    			element: 0,
    			class: 2,
    			override: 3,
    			shadow: 7,
    			radius: 8,
    			withBorder: 9,
    			padding: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paper",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get use() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shadow() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shadow(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withBorder() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withBorder(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Paper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Paper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Paper$1 = Paper;

    const POSITIONS = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
        apart: 'space-between'
    };
    var useStyles$4 = createStyles((theme, { align, direction, grow, noWrap, position, spacing, children }) => {
        return {
            root: {
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: direction,
                alignItems: align ||
                    (direction === 'row'
                        ? 'center'
                        : grow
                            ? 'stretch'
                            : position === 'apart'
                                ? 'flex-start'
                                : POSITIONS[position]),
                flexWrap: noWrap ? 'nowrap' : 'wrap',
                justifyContent: direction === 'row' ? POSITIONS[position] : undefined,
                gap: theme.fn.size({ size: spacing, sizes: theme.space }),
                '& > *': {
                    boxSizing: 'border-box',
                    maxWidth: grow && direction === 'row'
                        ? `calc(${100 / children}% - ${theme.fn.size({ size: spacing, sizes: theme.space }) -
                        theme.fn.size({ size: spacing, sizes: theme.space }) / children}px)`
                        : undefined,
                    flexGrow: grow ? 1 : 0
                }
            }
        };
    });

    /* node_modules/@svelteuidev/core/components/Group/Group.svelte generated by Svelte v3.55.1 */

    // (39:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>
    function create_default_slot$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(39:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let box;
    	let updating_element;
    	let current;

    	const box_spread_levels = [
    		{ use: /*use*/ ctx[1] },
    		{
    			class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	function box_element_binding(value) {
    		/*box_element_binding*/ ctx[15](value);
    	}

    	let box_props = {
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < box_spread_levels.length; i += 1) {
    		box_props = assign(box_props, box_spread_levels[i]);
    	}

    	if (/*element*/ ctx[0] !== void 0) {
    		box_props.element = /*element*/ ctx[0];
    	}

    	box = new Box$1({ props: box_props, $$inline: true });
    	binding_callbacks.push(() => bind(box, 'element', box_element_binding));

    	const block = {
    		c: function create() {
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const box_changes = (dirty & /*use, cx, className, getStyles, override, $$restProps*/ 126)
    			? get_spread_update(box_spread_levels, [
    					dirty & /*use*/ 2 && { use: /*use*/ ctx[1] },
    					dirty & /*cx, className, getStyles, override*/ 60 && {
    						class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    					},
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 65536) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*element*/ 1) {
    				updating_element = true;
    				box_changes.element = /*element*/ ctx[0];
    				add_flush_callback(() => updating_element = false);
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let cx;
    	let getStyles;

    	const omit_props_names = [
    		"use","element","class","override","position","noWrap","grow","spacing","direction","align"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Group', slots, ['default']);
    	let { use = [], element = undefined, class: className = '', override = {}, position = 'left', noWrap = false, grow = false, spacing = 'md', direction = 'row', align = 'center' } = $$props;

    	/** The children being rendered */
    	let children;

    	function box_element_binding(value) {
    		element = value;
    		$$invalidate(0, element);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('override' in $$new_props) $$invalidate(3, override = $$new_props.override);
    		if ('position' in $$new_props) $$invalidate(7, position = $$new_props.position);
    		if ('noWrap' in $$new_props) $$invalidate(8, noWrap = $$new_props.noWrap);
    		if ('grow' in $$new_props) $$invalidate(9, grow = $$new_props.grow);
    		if ('spacing' in $$new_props) $$invalidate(10, spacing = $$new_props.spacing);
    		if ('direction' in $$new_props) $$invalidate(11, direction = $$new_props.direction);
    		if ('align' in $$new_props) $$invalidate(12, align = $$new_props.align);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		useStyles: useStyles$4,
    		onMount,
    		Box: Box$1,
    		use,
    		element,
    		className,
    		override,
    		position,
    		noWrap,
    		grow,
    		spacing,
    		direction,
    		align,
    		children,
    		getStyles,
    		cx
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('override' in $$props) $$invalidate(3, override = $$new_props.override);
    		if ('position' in $$props) $$invalidate(7, position = $$new_props.position);
    		if ('noWrap' in $$props) $$invalidate(8, noWrap = $$new_props.noWrap);
    		if ('grow' in $$props) $$invalidate(9, grow = $$new_props.grow);
    		if ('spacing' in $$props) $$invalidate(10, spacing = $$new_props.spacing);
    		if ('direction' in $$props) $$invalidate(11, direction = $$new_props.direction);
    		if ('align' in $$props) $$invalidate(12, align = $$new_props.align);
    		if ('children' in $$props) $$invalidate(13, children = $$new_props.children);
    		if ('getStyles' in $$props) $$invalidate(4, getStyles = $$new_props.getStyles);
    		if ('cx' in $$props) $$invalidate(5, cx = $$new_props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*element*/ 1) {
    			/** can only get access to children at runtime */
    			onMount(() => {
    				$$invalidate(13, children = element.childElementCount);
    			});
    		}

    		if ($$self.$$.dirty & /*align, children, direction, grow, noWrap, position, spacing*/ 16256) {
    			$$invalidate(
    				5,
    				{ cx, getStyles } = useStyles$4(
    					{
    						align,
    						children,
    						direction,
    						grow,
    						noWrap,
    						position,
    						spacing
    					},
    					{ name: 'Group' }
    				),
    				cx,
    				(((((((($$invalidate(4, getStyles), $$invalidate(12, align)), $$invalidate(13, children)), $$invalidate(11, direction)), $$invalidate(9, grow)), $$invalidate(8, noWrap)), $$invalidate(7, position)), $$invalidate(10, spacing)), $$invalidate(0, element))
    			);
    		}
    	};

    	return [
    		element,
    		use,
    		className,
    		override,
    		getStyles,
    		cx,
    		$$restProps,
    		position,
    		noWrap,
    		grow,
    		spacing,
    		direction,
    		align,
    		children,
    		slots,
    		box_element_binding,
    		$$scope
    	];
    }

    class Group extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$h, safe_not_equal, {
    			use: 1,
    			element: 0,
    			class: 2,
    			override: 3,
    			position: 7,
    			noWrap: 8,
    			grow: 9,
    			spacing: 10,
    			direction: 11,
    			align: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Group",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get use() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noWrap() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noWrap(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get grow() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set grow(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Group$1 = Group;

    /** Makeshift theme object containing breakpoints for function */
    const theme = {
        spacing: {
            xs: 10,
            sm: 12,
            md: 16,
            lg: 20,
            xl: 24
        },
        breakpoints: {
            xs: 576,
            sm: 768,
            md: 992,
            lg: 1200,
            xl: 1400
        }
    };
    function size(props) {
        if (typeof props.size === 'number') {
            return props.size;
        }
        return props.sizes[props.size] || props.size || props.sizes.md;
    }
    function getSortedBreakpoints(theme, breakpoints) {
        if (breakpoints.length === 0) {
            return breakpoints;
        }
        const property = 'maxWidth' in breakpoints[0] ? 'maxWidth' : 'minWidth';
        const sorted = [...breakpoints].sort((a, b) => size({ size: b[property], sizes: theme.breakpoints }) -
            size({ size: a[property], sizes: theme.breakpoints }));
        return property === 'minWidth' ? sorted.reverse() : sorted;
    }

    var useStyles$3 = createStyles((theme, { cols, spacing, gridBreakpoints }) => {
        return {
            root: {
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: theme.fn.size({ size: spacing, sizes: theme.space }),
                ...gridBreakpoints
            }
        };
    });

    /* node_modules/@svelteuidev/core/components/SimpleGrid/SimpleGrid.svelte generated by Svelte v3.55.1 */

    // (38:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>
    function create_default_slot$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(38:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let box;
    	let updating_element;
    	let current;

    	const box_spread_levels = [
    		{ use: /*use*/ ctx[1] },
    		{
    			class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	function box_element_binding(value) {
    		/*box_element_binding*/ ctx[12](value);
    	}

    	let box_props = {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < box_spread_levels.length; i += 1) {
    		box_props = assign(box_props, box_spread_levels[i]);
    	}

    	if (/*element*/ ctx[0] !== void 0) {
    		box_props.element = /*element*/ ctx[0];
    	}

    	box = new Box$1({ props: box_props, $$inline: true });
    	binding_callbacks.push(() => bind(box, 'element', box_element_binding));

    	const block = {
    		c: function create() {
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const box_changes = (dirty & /*use, cx, className, getStyles, override, $$restProps*/ 126)
    			? get_spread_update(box_spread_levels, [
    					dirty & /*use*/ 2 && { use: /*use*/ ctx[1] },
    					dirty & /*cx, className, getStyles, override*/ 60 && {
    						class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    					},
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 8192) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*element*/ 1) {
    				updating_element = true;
    				box_changes.element = /*element*/ ctx[0];
    				add_flush_callback(() => updating_element = false);
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let gridBreakpoints;
    	let cx;
    	let getStyles;
    	const omit_props_names = ["use","element","class","override","breakpoints","cols","spacing"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SimpleGrid', slots, ['default']);
    	let { use = [], element = undefined, class: className = '', override = {}, breakpoints = [], cols = 1, spacing = 'md' } = $$props;

    	function box_element_binding(value) {
    		element = value;
    		$$invalidate(0, element);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('override' in $$new_props) $$invalidate(3, override = $$new_props.override);
    		if ('breakpoints' in $$new_props) $$invalidate(7, breakpoints = $$new_props.breakpoints);
    		if ('cols' in $$new_props) $$invalidate(8, cols = $$new_props.cols);
    		if ('spacing' in $$new_props) $$invalidate(9, spacing = $$new_props.spacing);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Box: Box$1,
    		getSortedBreakpoints,
    		size,
    		theme,
    		useStyles: useStyles$3,
    		use,
    		element,
    		className,
    		override,
    		breakpoints,
    		cols,
    		spacing,
    		gridBreakpoints,
    		getStyles,
    		cx
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('override' in $$props) $$invalidate(3, override = $$new_props.override);
    		if ('breakpoints' in $$props) $$invalidate(7, breakpoints = $$new_props.breakpoints);
    		if ('cols' in $$props) $$invalidate(8, cols = $$new_props.cols);
    		if ('spacing' in $$props) $$invalidate(9, spacing = $$new_props.spacing);
    		if ('gridBreakpoints' in $$props) $$invalidate(10, gridBreakpoints = $$new_props.gridBreakpoints);
    		if ('getStyles' in $$props) $$invalidate(4, getStyles = $$new_props.getStyles);
    		if ('cx' in $$props) $$invalidate(5, cx = $$new_props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*breakpoints, spacing*/ 640) {
    			$$invalidate(10, gridBreakpoints = getSortedBreakpoints(theme, breakpoints).reduce(
    				(acc, breakpoint) => {
    					const property = 'maxWidth' in breakpoint ? 'max-width' : 'min-width';

    					const breakpointSize = size({
    						size: property === 'max-width'
    						? breakpoint.maxWidth
    						: breakpoint.minWidth,
    						sizes: theme.breakpoints
    					});

    					acc[`@media (${property}: ${breakpointSize + (property === 'max-width' ? 0 : 1)}px)`] = {
    						gridTemplateColumns: `repeat(${breakpoint.cols}, minmax(0, 1fr))`,
    						gap: size({
    							size: breakpoint.spacing || spacing,
    							sizes: theme.spacing
    						})
    					};

    					return acc;
    				},
    				{}
    			));
    		}

    		if ($$self.$$.dirty & /*cols, spacing, gridBreakpoints*/ 1792) {
    			$$invalidate(5, { cx, getStyles } = useStyles$3({ cols, spacing, gridBreakpoints }, { name: 'SimpleGrid' }), cx, (((($$invalidate(4, getStyles), $$invalidate(8, cols)), $$invalidate(9, spacing)), $$invalidate(10, gridBreakpoints)), $$invalidate(7, breakpoints)));
    		}
    	};

    	return [
    		element,
    		use,
    		className,
    		override,
    		getStyles,
    		cx,
    		$$restProps,
    		breakpoints,
    		cols,
    		spacing,
    		gridBreakpoints,
    		slots,
    		box_element_binding,
    		$$scope
    	];
    }

    class SimpleGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$g, safe_not_equal, {
    			use: 1,
    			element: 0,
    			class: 2,
    			override: 3,
    			breakpoints: 7,
    			cols: 8,
    			spacing: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimpleGrid",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get use() {
    		throw new Error("<SimpleGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<SimpleGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<SimpleGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<SimpleGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<SimpleGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<SimpleGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error("<SimpleGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<SimpleGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breakpoints() {
    		throw new Error("<SimpleGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breakpoints(value) {
    		throw new Error("<SimpleGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<SimpleGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<SimpleGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing() {
    		throw new Error("<SimpleGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing(value) {
    		throw new Error("<SimpleGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SimpleGrid$1 = SimpleGrid;

    var useStyles$2 = createStyles((theme, { h, w }) => {
        return {
            root: {
                width: theme.fn.size({ size: w, sizes: theme.space }),
                minWidth: theme.fn.size({ size: w, sizes: theme.space }),
                height: theme.fn.size({ size: h, sizes: theme.space }),
                minHeight: theme.fn.size({ size: h, sizes: theme.space })
            }
        };
    });

    /* node_modules/@svelteuidev/core/components/Space/Space.svelte generated by Svelte v3.55.1 */

    // (21:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>
    function create_default_slot$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(21:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let box;
    	let updating_element;
    	let current;

    	const box_spread_levels = [
    		{ use: /*use*/ ctx[1] },
    		{
    			class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	function box_element_binding(value) {
    		/*box_element_binding*/ ctx[10](value);
    	}

    	let box_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < box_spread_levels.length; i += 1) {
    		box_props = assign(box_props, box_spread_levels[i]);
    	}

    	if (/*element*/ ctx[0] !== void 0) {
    		box_props.element = /*element*/ ctx[0];
    	}

    	box = new Box$1({ props: box_props, $$inline: true });
    	binding_callbacks.push(() => bind(box, 'element', box_element_binding));

    	const block = {
    		c: function create() {
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const box_changes = (dirty & /*use, cx, className, getStyles, override, $$restProps*/ 126)
    			? get_spread_update(box_spread_levels, [
    					dirty & /*use*/ 2 && { use: /*use*/ ctx[1] },
    					dirty & /*cx, className, getStyles, override*/ 60 && {
    						class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    					},
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 2048) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*element*/ 1) {
    				updating_element = true;
    				box_changes.element = /*element*/ ctx[0];
    				add_flush_callback(() => updating_element = false);
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let cx;
    	let getStyles;
    	const omit_props_names = ["use","element","class","override","w","h"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Space', slots, ['default']);
    	let { use = [], element = undefined, class: className = '', override = {}, w = 0, h = 0 } = $$props;

    	function box_element_binding(value) {
    		element = value;
    		$$invalidate(0, element);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('override' in $$new_props) $$invalidate(3, override = $$new_props.override);
    		if ('w' in $$new_props) $$invalidate(7, w = $$new_props.w);
    		if ('h' in $$new_props) $$invalidate(8, h = $$new_props.h);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Box: Box$1,
    		useStyles: useStyles$2,
    		use,
    		element,
    		className,
    		override,
    		w,
    		h,
    		getStyles,
    		cx
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('override' in $$props) $$invalidate(3, override = $$new_props.override);
    		if ('w' in $$props) $$invalidate(7, w = $$new_props.w);
    		if ('h' in $$props) $$invalidate(8, h = $$new_props.h);
    		if ('getStyles' in $$props) $$invalidate(4, getStyles = $$new_props.getStyles);
    		if ('cx' in $$props) $$invalidate(5, cx = $$new_props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*h, w*/ 384) {
    			$$invalidate(5, { cx, getStyles } = useStyles$2({ h, w }, { name: 'Space' }), cx, (($$invalidate(4, getStyles), $$invalidate(8, h)), $$invalidate(7, w)));
    		}
    	};

    	return [
    		element,
    		use,
    		className,
    		override,
    		getStyles,
    		cx,
    		$$restProps,
    		w,
    		h,
    		slots,
    		box_element_binding,
    		$$scope
    	];
    }

    class Space extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$f, safe_not_equal, {
    			use: 1,
    			element: 0,
    			class: 2,
    			override: 3,
    			w: 7,
    			h: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Space",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get use() {
    		throw new Error("<Space>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Space>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Space>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Space>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Space>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Space>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error("<Space>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<Space>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get w() {
    		throw new Error("<Space>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set w(value) {
    		throw new Error("<Space>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<Space>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<Space>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Space$1 = Space;

    var useStyles$1 = createStyles((theme, { align, justify, spacing }) => {
        return {
            root: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: `${align}`,
                justifyContent: `${justify}`,
                gap: theme.fn.size({ size: spacing, sizes: theme.space })
            }
        };
    });

    /* node_modules/@svelteuidev/core/components/Stack/Stack.svelte generated by Svelte v3.55.1 */

    // (24:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>
    function create_default_slot$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(24:0) <Box bind:element {use} class={cx(className, getStyles({ css: override }))} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let box;
    	let updating_element;
    	let current;

    	const box_spread_levels = [
    		{ use: /*use*/ ctx[1] },
    		{
    			class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	function box_element_binding(value) {
    		/*box_element_binding*/ ctx[11](value);
    	}

    	let box_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < box_spread_levels.length; i += 1) {
    		box_props = assign(box_props, box_spread_levels[i]);
    	}

    	if (/*element*/ ctx[0] !== void 0) {
    		box_props.element = /*element*/ ctx[0];
    	}

    	box = new Box$1({ props: box_props, $$inline: true });
    	binding_callbacks.push(() => bind(box, 'element', box_element_binding));

    	const block = {
    		c: function create() {
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const box_changes = (dirty & /*use, cx, className, getStyles, override, $$restProps*/ 126)
    			? get_spread_update(box_spread_levels, [
    					dirty & /*use*/ 2 && { use: /*use*/ ctx[1] },
    					dirty & /*cx, className, getStyles, override*/ 60 && {
    						class: /*cx*/ ctx[5](/*className*/ ctx[2], /*getStyles*/ ctx[4]({ css: /*override*/ ctx[3] }))
    					},
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 4096) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*element*/ 1) {
    				updating_element = true;
    				box_changes.element = /*element*/ ctx[0];
    				add_flush_callback(() => updating_element = false);
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let cx;
    	let getStyles;
    	const omit_props_names = ["use","element","class","override","spacing","align","justify"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stack', slots, ['default']);
    	let { use = [], element = undefined, class: className = '', override = {}, spacing = 'md', align = 'stretch', justify = 'center' } = $$props;

    	function box_element_binding(value) {
    		element = value;
    		$$invalidate(0, element);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('override' in $$new_props) $$invalidate(3, override = $$new_props.override);
    		if ('spacing' in $$new_props) $$invalidate(7, spacing = $$new_props.spacing);
    		if ('align' in $$new_props) $$invalidate(8, align = $$new_props.align);
    		if ('justify' in $$new_props) $$invalidate(9, justify = $$new_props.justify);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Box: Box$1,
    		useStyles: useStyles$1,
    		use,
    		element,
    		className,
    		override,
    		spacing,
    		align,
    		justify,
    		getStyles,
    		cx
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('override' in $$props) $$invalidate(3, override = $$new_props.override);
    		if ('spacing' in $$props) $$invalidate(7, spacing = $$new_props.spacing);
    		if ('align' in $$props) $$invalidate(8, align = $$new_props.align);
    		if ('justify' in $$props) $$invalidate(9, justify = $$new_props.justify);
    		if ('getStyles' in $$props) $$invalidate(4, getStyles = $$new_props.getStyles);
    		if ('cx' in $$props) $$invalidate(5, cx = $$new_props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*align, justify, spacing*/ 896) {
    			$$invalidate(5, { cx, getStyles } = useStyles$1({ align, justify, spacing }, { name: 'Stack' }), cx, ((($$invalidate(4, getStyles), $$invalidate(8, align)), $$invalidate(9, justify)), $$invalidate(7, spacing)));
    		}
    	};

    	return [
    		element,
    		use,
    		className,
    		override,
    		getStyles,
    		cx,
    		$$restProps,
    		spacing,
    		align,
    		justify,
    		slots,
    		box_element_binding,
    		$$scope
    	];
    }

    class Stack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$e, safe_not_equal, {
    			use: 1,
    			element: 0,
    			class: 2,
    			override: 3,
    			spacing: 7,
    			align: 8,
    			justify: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stack",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get use() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justify() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justify(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Stack$1 = Stack;

    const radii = {
        xs: 2,
        sm: 4,
        md: 8,
        lg: 16,
        xl: 32
    };
    const sizes = {
        xs: {
            height: 16,
            width: 30,
            handle: 12,
            labelFont: 12,
            insideLabelFont: 5
        },
        sm: {
            height: 20,
            width: 38,
            handle: 14,
            labelFont: 14,
            insideLabelFont: 6
        },
        md: {
            height: 24,
            width: 46,
            handle: 18,
            labelFont: 16,
            insideLabelFont: 7
        },
        lg: {
            height: 30,
            width: 56,
            handle: 22,
            labelFont: 18,
            insideLabelFont: 9
        },
        xl: {
            height: 36,
            width: 68,
            handle: 28,
            labelFont: 20,
            insideLabelFont: 11
        }
    };
    var useStyles = createStyles((theme, { radius, size, transitionFunction, color, offLabel, onLabel }) => {
        return {
            root: {
                display: 'flex',
                alignItems: 'center'
            },
            input: {
                focusRing: 'auto',
                overflow: 'hidden',
                WebkitTapHighlightColor: 'transparent',
                position: 'relative',
                borderRadius: radii[radius],
                backgroundColor: theme.fn.themeColor('gray', 2),
                border: `1px solid ${theme.fn.themeColor('gray', 3)}`,
                height: sizes[size].height,
                width: sizes[size].width,
                minWidth: sizes[size].width,
                margin: 0,
                transitionProperty: 'background-color, border-color',
                transitionTimingFunction: transitionFunction,
                transitionDuration: '150ms',
                boxSizing: 'border-box',
                appearance: 'none',
                display: 'flex',
                alignItems: 'center',
                fontSize: sizes[size].insideLabelFont,
                fontWeight: 600,
                [`${dark.selector} &`]: {
                    backgroundColor: theme.fn.themeColor('dark', 6),
                    borderColor: theme.fn.themeColor('dark', 4)
                },
                '&:hover': { cursor: 'pointer' },
                '&::before': {
                    zIndex: 1,
                    borderRadius: radii[radius],
                    boxSizing: 'border-box',
                    content: "''",
                    display: 'block',
                    backgroundColor: 'White',
                    border: `1px solid ${theme.fn.themeColor('gray', 3)}`,
                    height: sizes[size].handle,
                    width: sizes[size].handle,
                    transition: `transform 150ms ${transitionFunction}`,
                    transform: `translateX(${size === 'xs' ? 1 : 2}px)`,
                    '@media (prefers-reduced-motion)': {
                        transitionDuration: '0ms'
                    },
                    [`${dark.selector} &`]: {
                        borderColor: 'White'
                    }
                },
                '&::after': {
                    position: 'absolute',
                    zIndex: 0,
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    lineHeight: 0,
                    right: '10%',
                    transform: 'translateX(0)',
                    content: offLabel ? `'${offLabel}'` : "''",
                    color: theme.fn.themeColor('gray', 6),
                    transition: `color 150ms ${transitionFunction}`,
                    [`${dark.selector} &`]: {
                        color: theme.fn.themeColor('dark', 1)
                    }
                },
                '&:checked': {
                    backgroundColor: theme.fn.themeColor(color, 6),
                    borderColor: theme.fn.themeColor(color, 6),
                    '&::before': {
                        transform: `translateX(${sizes[size].width - sizes[size].handle - (size === 'xs' ? 3 : 4)}px)`,
                        borderColor: 'White'
                    },
                    '&::after': {
                        transform: 'translateX(-200%)',
                        content: onLabel ? `'${onLabel}'` : "''",
                        color: 'White'
                    }
                },
                '&.disabled': {
                    backgroundColor: theme.fn.themeColor('gray', 2),
                    borderColor: theme.fn.themeColor('gray', 2),
                    cursor: 'not-allowed',
                    [`${dark.selector} &`]: {
                        backgroundColor: theme.fn.themeColor('dark', 4),
                        borderColor: theme.fn.themeColor('dark', 3)
                    },
                    '&::before': {
                        borderColor: theme.fn.themeColor('gray', 2),
                        backgroundColor: theme.fn.themeColor('gray', 0),
                        [`${dark.selector} &`]: {
                            backgroundColor: theme.fn.themeColor('dark', 3),
                            borderColor: theme.fn.themeColor('dark', 4)
                        }
                    }
                }
            },
            label: {
                fontSize: sizes[size].labelFont,
                lineHeight: `${sizes[size].height}px`,
                fontWeight: 600,
                paddingLeft: theme.fn.size({ size: 'sm', sizes: theme.space })
            }
        };
    });

    /* node_modules/@svelteuidev/core/components/Switch/Switch.svelte generated by Svelte v3.55.1 */
    const file$d = "node_modules/@svelteuidev/core/components/Switch/Switch.svelte";

    // (43:1) {#if label}
    function create_if_block$3(ctx) {
    	let label_1;
    	let t;
    	let label_1_class_value;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t = text(/*label*/ ctx[6]);
    			attr_dev(label_1, "for", /*id*/ ctx[5]);
    			attr_dev(label_1, "class", label_1_class_value = "" + (null_to_empty(/*classes*/ ctx[9].label) + " svelte-1oesh6k"));
    			add_location(label_1, file$d, 43, 2, 1392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 64) set_data_dev(t, /*label*/ ctx[6]);

    			if (dirty & /*id*/ 32) {
    				attr_dev(label_1, "for", /*id*/ ctx[5]);
    			}

    			if (dirty & /*classes*/ 512 && label_1_class_value !== (label_1_class_value = "" + (null_to_empty(/*classes*/ ctx[9].label) + " svelte-1oesh6k"))) {
    				attr_dev(label_1, "class", label_1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(43:1) {#if label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let input;
    	let input_class_value;
    	let useActions_action;
    	let t;
    	let div_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*label*/ ctx[6] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(input, "id", /*id*/ ctx[5]);
    			input.disabled = /*disabled*/ ctx[7];
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*cx*/ ctx[10](/*className*/ ctx[3], /*classes*/ ctx[9].input, /*getStyles*/ ctx[8]({ css: /*override*/ ctx[4] }))) + " svelte-1oesh6k"));
    			toggle_class(input, "disabled", /*disabled*/ ctx[7]);
    			add_location(input, file$d, 31, 1, 1162);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*cx*/ ctx[10]('switch', /*classes*/ ctx[9].root, /*className*/ ctx[3])) + " svelte-1oesh6k"));
    			add_location(div, file$d, 30, 0, 1109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			/*input_binding*/ ctx[18](input);
    			input.checked = /*checked*/ ctx[1];
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions$1.call(null, input, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[11].call(null, input)),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[19])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 32) {
    				attr_dev(input, "id", /*id*/ ctx[5]);
    			}

    			if (dirty & /*disabled*/ 128) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[7]);
    			}

    			if (dirty & /*cx, className, classes, getStyles, override*/ 1816 && input_class_value !== (input_class_value = "" + (null_to_empty(/*cx*/ ctx[10](/*className*/ ctx[3], /*classes*/ ctx[9].input, /*getStyles*/ ctx[8]({ css: /*override*/ ctx[4] }))) + " svelte-1oesh6k"))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 4) useActions_action.update.call(null, /*use*/ ctx[2]);

    			if (dirty & /*checked*/ 2) {
    				input.checked = /*checked*/ ctx[1];
    			}

    			if (dirty & /*cx, className, classes, getStyles, override, disabled*/ 1944) {
    				toggle_class(input, "disabled", /*disabled*/ ctx[7]);
    			}

    			if (/*label*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*cx, classes, className*/ 1544 && div_class_value !== (div_class_value = "" + (null_to_empty(/*cx*/ ctx[10]('switch', /*classes*/ ctx[9].root, /*className*/ ctx[3])) + " svelte-1oesh6k"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[18](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let cx;
    	let classes;
    	let getStyles;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Switch', slots, []);
    	let { use = [], element = undefined, class: className = '', override = {}, color = 'blue', size = 'sm', radius = 'xl', transitionFunction = 'linear', id = randomID(), label = '', onLabel = '', offLabel = '', disabled = false, checked = false } = $$props;

    	/** An action that forwards inner dom node events from parent component */
    	const forwardEvents = createEventForwarder(get_current_component());

    	const writable_props = [
    		'use',
    		'element',
    		'class',
    		'override',
    		'color',
    		'size',
    		'radius',
    		'transitionFunction',
    		'id',
    		'label',
    		'onLabel',
    		'offLabel',
    		'disabled',
    		'checked'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(1, checked);
    	}

    	$$self.$$set = $$props => {
    		if ('use' in $$props) $$invalidate(2, use = $$props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('class' in $$props) $$invalidate(3, className = $$props.class);
    		if ('override' in $$props) $$invalidate(4, override = $$props.override);
    		if ('color' in $$props) $$invalidate(12, color = $$props.color);
    		if ('size' in $$props) $$invalidate(13, size = $$props.size);
    		if ('radius' in $$props) $$invalidate(14, radius = $$props.radius);
    		if ('transitionFunction' in $$props) $$invalidate(15, transitionFunction = $$props.transitionFunction);
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('label' in $$props) $$invalidate(6, label = $$props.label);
    		if ('onLabel' in $$props) $$invalidate(16, onLabel = $$props.onLabel);
    		if ('offLabel' in $$props) $$invalidate(17, offLabel = $$props.offLabel);
    		if ('disabled' in $$props) $$invalidate(7, disabled = $$props.disabled);
    		if ('checked' in $$props) $$invalidate(1, checked = $$props.checked);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		useActions: useActions$1,
    		randomID,
    		useStyles,
    		use,
    		element,
    		className,
    		override,
    		color,
    		size,
    		radius,
    		transitionFunction,
    		id,
    		label,
    		onLabel,
    		offLabel,
    		disabled,
    		checked,
    		forwardEvents,
    		getStyles,
    		classes,
    		cx
    	});

    	$$self.$inject_state = $$props => {
    		if ('use' in $$props) $$invalidate(2, use = $$props.use);
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    		if ('override' in $$props) $$invalidate(4, override = $$props.override);
    		if ('color' in $$props) $$invalidate(12, color = $$props.color);
    		if ('size' in $$props) $$invalidate(13, size = $$props.size);
    		if ('radius' in $$props) $$invalidate(14, radius = $$props.radius);
    		if ('transitionFunction' in $$props) $$invalidate(15, transitionFunction = $$props.transitionFunction);
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('label' in $$props) $$invalidate(6, label = $$props.label);
    		if ('onLabel' in $$props) $$invalidate(16, onLabel = $$props.onLabel);
    		if ('offLabel' in $$props) $$invalidate(17, offLabel = $$props.offLabel);
    		if ('disabled' in $$props) $$invalidate(7, disabled = $$props.disabled);
    		if ('checked' in $$props) $$invalidate(1, checked = $$props.checked);
    		if ('getStyles' in $$props) $$invalidate(8, getStyles = $$props.getStyles);
    		if ('classes' in $$props) $$invalidate(9, classes = $$props.classes);
    		if ('cx' in $$props) $$invalidate(10, cx = $$props.cx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color, offLabel, onLabel, radius, size, transitionFunction*/ 258048) {
    			$$invalidate(
    				10,
    				{ cx, classes, getStyles } = useStyles(
    					{
    						color,
    						offLabel,
    						onLabel,
    						radius,
    						size,
    						transitionFunction
    					},
    					{ name: 'Switch' }
    				),
    				cx,
    				(((((($$invalidate(9, classes), $$invalidate(12, color)), $$invalidate(17, offLabel)), $$invalidate(16, onLabel)), $$invalidate(14, radius)), $$invalidate(13, size)), $$invalidate(15, transitionFunction)),
    				(((((($$invalidate(8, getStyles), $$invalidate(12, color)), $$invalidate(17, offLabel)), $$invalidate(16, onLabel)), $$invalidate(14, radius)), $$invalidate(13, size)), $$invalidate(15, transitionFunction))
    			);
    		}
    	};

    	return [
    		element,
    		checked,
    		use,
    		className,
    		override,
    		id,
    		label,
    		disabled,
    		getStyles,
    		classes,
    		cx,
    		forwardEvents,
    		color,
    		size,
    		radius,
    		transitionFunction,
    		onLabel,
    		offLabel,
    		input_binding,
    		input_change_handler
    	];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$d, safe_not_equal, {
    			use: 2,
    			element: 0,
    			class: 3,
    			override: 4,
    			color: 12,
    			size: 13,
    			radius: 14,
    			transitionFunction: 15,
    			id: 5,
    			label: 6,
    			onLabel: 16,
    			offLabel: 17,
    			disabled: 7,
    			checked: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get use() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get override() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionFunction() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionFunction(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onLabel() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onLabel(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offLabel() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offLabel(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Switch$1 = Switch;

    /* src/components/icons/LightBulb.svelte generated by Svelte v3.55.1 */

    const file$c = "src/components/icons/LightBulb.svelte";

    function create_fragment$c(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	let svg_levels = [
    		{ width: /*size*/ ctx[1] },
    		{ height: /*size*/ ctx[1] },
    		{ viewBox: "0 0 24 24" },
    		{ fill: "none" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		/*$$restProps*/ ctx[2]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$c, 13, 4, 200);
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "clip-rule", "evenodd");
    			attr_dev(path1, "d", "M9.973 18H11v-5h2v5h1.027c.132-1.202.745-2.194 1.74-3.277.113-.122.832-.867.917-.973a6 6 0 1 0-9.37-.002c.086.107.807.853.918.974.996 1.084 1.609 2.076 1.741 3.278zM10 20v1h4v-1h-4zm-4.246-5a8 8 0 1 1 12.49.002C17.624 15.774 16 17 16 18.5V21a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C8 17 6.375 15.774 5.754 15z");
    			attr_dev(path1, "fill", /*color*/ ctx[0]);
    			add_location(path1, file$c, 17, 4, 263);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$c, 5, 0, 72);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				attr_dev(path1, "fill", /*color*/ ctx[0]);
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*size*/ 2 && { width: /*size*/ ctx[1] },
    				dirty & /*size*/ 2 && { height: /*size*/ ctx[1] },
    				{ viewBox: "0 0 24 24" },
    				{ fill: "none" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["color","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LightBulb', slots, []);
    	let { color = 'white' } = $$props;
    	let { size = 15 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('color' in $$new_props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ color, size });

    	$$self.$inject_state = $$new_props => {
    		if ('color' in $$props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, size, $$restProps];
    }

    class LightBulb extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$c, safe_not_equal, { color: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LightBulb",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get color() {
    		throw new Error("<LightBulb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<LightBulb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<LightBulb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<LightBulb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/radix-icons-svelte/Icons/CaretLeft.svelte generated by Svelte v3.55.1 */

    const file$b = "node_modules/radix-icons-svelte/Icons/CaretLeft.svelte";

    function create_fragment$b(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ width: /*size*/ ctx[1] },
    		{ height: /*size*/ ctx[1] },
    		{ viewBox: "0 0 15 15" },
    		{ fill: "none" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		/*$$restProps*/ ctx[2]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z");
    			attr_dev(path, "fill", /*color*/ ctx[0]);
    			add_location(path, file$b, 13, 1, 204);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$b, 5, 0, 79);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				attr_dev(path, "fill", /*color*/ ctx[0]);
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*size*/ 2 && { width: /*size*/ ctx[1] },
    				dirty & /*size*/ 2 && { height: /*size*/ ctx[1] },
    				{ viewBox: "0 0 15 15" },
    				{ fill: "none" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["color","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CaretLeft', slots, []);
    	let { color = 'currentColor' } = $$props;
    	let { size = 15 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('color' in $$new_props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ color, size });

    	$$self.$inject_state = $$new_props => {
    		if ('color' in $$props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, size, $$restProps];
    }

    class CaretLeft extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$b, safe_not_equal, { color: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaretLeft",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get color() {
    		throw new Error("<CaretLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CaretLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<CaretLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CaretLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CaretLeft$1 = CaretLeft;

    /* node_modules/radix-icons-svelte/Icons/CaretRight.svelte generated by Svelte v3.55.1 */

    const file$a = "node_modules/radix-icons-svelte/Icons/CaretRight.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ width: /*size*/ ctx[1] },
    		{ height: /*size*/ ctx[1] },
    		{ viewBox: "0 0 15 15" },
    		{ fill: "none" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		/*$$restProps*/ ctx[2]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z");
    			attr_dev(path, "fill", /*color*/ ctx[0]);
    			add_location(path, file$a, 13, 1, 204);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$a, 5, 0, 79);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				attr_dev(path, "fill", /*color*/ ctx[0]);
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*size*/ 2 && { width: /*size*/ ctx[1] },
    				dirty & /*size*/ 2 && { height: /*size*/ ctx[1] },
    				{ viewBox: "0 0 15 15" },
    				{ fill: "none" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = ["color","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CaretRight', slots, []);
    	let { color = 'currentColor' } = $$props;
    	let { size = 15 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('color' in $$new_props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ color, size });

    	$$self.$inject_state = $$new_props => {
    		if ('color' in $$props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, size, $$restProps];
    }

    class CaretRight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$a, safe_not_equal, { color: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaretRight",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get color() {
    		throw new Error("<CaretRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CaretRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<CaretRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CaretRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CaretRight$1 = CaretRight;

    /* node_modules/radix-icons-svelte/Icons/HamburgerMenu.svelte generated by Svelte v3.55.1 */

    const file$9 = "node_modules/radix-icons-svelte/Icons/HamburgerMenu.svelte";

    function create_fragment$9(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ width: /*size*/ ctx[1] },
    		{ height: /*size*/ ctx[1] },
    		{ viewBox: "0 0 15 15" },
    		{ fill: "none" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		/*$$restProps*/ ctx[2]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z");
    			attr_dev(path, "fill", /*color*/ ctx[0]);
    			add_location(path, file$9, 13, 1, 204);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$9, 5, 0, 79);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				attr_dev(path, "fill", /*color*/ ctx[0]);
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*size*/ 2 && { width: /*size*/ ctx[1] },
    				dirty & /*size*/ 2 && { height: /*size*/ ctx[1] },
    				{ viewBox: "0 0 15 15" },
    				{ fill: "none" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["color","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HamburgerMenu', slots, []);
    	let { color = 'currentColor' } = $$props;
    	let { size = 15 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('color' in $$new_props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ color, size });

    	$$self.$inject_state = $$new_props => {
    		if ('color' in $$props) $$invalidate(0, color = $$new_props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, size, $$restProps];
    }

    class HamburgerMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$9, safe_not_equal, { color: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HamburgerMenu",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get color() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var HamburgerMenu$1 = HamburgerMenu;

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$1 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$1 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$1.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /** Slider element classes. */
    var cssClasses = {
        DISABLED: 'mdc-slider--disabled',
        DISCRETE: 'mdc-slider--discrete',
        INPUT: 'mdc-slider__input',
        RANGE: 'mdc-slider--range',
        THUMB: 'mdc-slider__thumb',
        // Applied when thumb is in the focused state.
        THUMB_FOCUSED: 'mdc-slider__thumb--focused',
        THUMB_KNOB: 'mdc-slider__thumb-knob',
        // Class added to the top thumb (for overlapping thumbs in range slider).
        THUMB_TOP: 'mdc-slider__thumb--top',
        THUMB_WITH_INDICATOR: 'mdc-slider__thumb--with-indicator',
        TICK_MARKS: 'mdc-slider--tick-marks',
        TICK_MARKS_CONTAINER: 'mdc-slider__tick-marks',
        TICK_MARK_ACTIVE: 'mdc-slider__tick-mark--active',
        TICK_MARK_INACTIVE: 'mdc-slider__tick-mark--inactive',
        TRACK: 'mdc-slider__track',
        // The active track fill element that will be scaled as the value changes.
        TRACK_ACTIVE: 'mdc-slider__track--active_fill',
        VALUE_INDICATOR_CONTAINER: 'mdc-slider__value-indicator-container',
        VALUE_INDICATOR_TEXT: 'mdc-slider__value-indicator-text',
    };
    /** Slider numbers. */
    var numbers = {
        // Default step size.
        STEP_SIZE: 1,
        // Default minimum difference between the start and end values.
        MIN_RANGE: 0,
        // Minimum absolute difference between clientX of move event / down event
        // for which to update thumb, in the case of overlapping thumbs.
        // This is needed to reduce chances of choosing the thumb based on
        // pointer jitter.
        THUMB_UPDATE_MIN_PX: 5,
    };
    /** Slider attributes. */
    var attributes = {
        ARIA_VALUETEXT: 'aria-valuetext',
        INPUT_DISABLED: 'disabled',
        INPUT_MIN: 'min',
        INPUT_MAX: 'max',
        INPUT_VALUE: 'value',
        INPUT_STEP: 'step',
        DATA_MIN_RANGE: 'data-min-range',
    };
    /** Slider strings. */
    var strings = {
        VAR_VALUE_INDICATOR_CARET_LEFT: '--slider-value-indicator-caret-left',
        VAR_VALUE_INDICATOR_CARET_RIGHT: '--slider-value-indicator-caret-right',
        VAR_VALUE_INDICATOR_CARET_TRANSFORM: '--slider-value-indicator-caret-transform',
        VAR_VALUE_INDICATOR_CONTAINER_LEFT: '--slider-value-indicator-container-left',
        VAR_VALUE_INDICATOR_CONTAINER_RIGHT: '--slider-value-indicator-container-right',
        VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM: '--slider-value-indicator-container-transform',
    };

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * AnimationFrame provides a user-friendly abstraction around requesting
     * and canceling animation frames.
     */
    var AnimationFrame = /** @class */ (function () {
        function AnimationFrame() {
            this.rafIDs = new Map();
        }
        /**
         * Requests an animation frame. Cancels any existing frame with the same key.
         * @param {string} key The key for this callback.
         * @param {FrameRequestCallback} callback The callback to be executed.
         */
        AnimationFrame.prototype.request = function (key, callback) {
            var _this = this;
            this.cancel(key);
            var frameID = requestAnimationFrame(function (frame) {
                _this.rafIDs.delete(key);
                // Callback must come *after* the key is deleted so that nested calls to
                // request with the same key are not deleted.
                callback(frame);
            });
            this.rafIDs.set(key, frameID);
        };
        /**
         * Cancels a queued callback with the given key.
         * @param {string} key The key for this callback.
         */
        AnimationFrame.prototype.cancel = function (key) {
            var rafID = this.rafIDs.get(key);
            if (rafID) {
                cancelAnimationFrame(rafID);
                this.rafIDs.delete(key);
            }
        };
        /**
         * Cancels all queued callback.
         */
        AnimationFrame.prototype.cancelAll = function () {
            var _this = this;
            // Need to use forEach because it's the only iteration method supported
            // by IE11. Suppress the underscore because we don't need it.
            // tslint:disable-next-line:enforce-name-casing
            this.rafIDs.forEach(function (_, key) {
                _this.cancel(key);
            });
        };
        /**
         * Returns the queue of unexecuted callback keys.
         */
        AnimationFrame.prototype.getQueue = function () {
            var queue = [];
            // Need to use forEach because it's the only iteration method supported
            // by IE11. Suppress the underscore because we don't need it.
            // tslint:disable-next-line:enforce-name-casing
            this.rafIDs.forEach(function (_, key) {
                queue.push(key);
            });
            return queue;
        };
        return AnimationFrame;
    }());

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssPropertyNameMap = {
        animation: {
            prefixed: '-webkit-animation',
            standard: 'animation',
        },
        transform: {
            prefixed: '-webkit-transform',
            standard: 'transform',
        },
        transition: {
            prefixed: '-webkit-transition',
            standard: 'transition',
        },
    };
    function isWindow(windowObj) {
        return Boolean(windowObj.document) && typeof windowObj.document.createElement === 'function';
    }
    function getCorrectPropertyName(windowObj, cssProperty) {
        if (isWindow(windowObj) && cssProperty in cssPropertyNameMap) {
            var el = windowObj.document.createElement('div');
            var _a = cssPropertyNameMap[cssProperty], standard = _a.standard, prefixed = _a.prefixed;
            var isStandard = standard in el.style;
            return isStandard ? standard : prefixed;
        }
        return cssProperty;
    }

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /** Tick mark enum, for discrete sliders. */
    var TickMark;
    (function (TickMark) {
        TickMark[TickMark["ACTIVE"] = 0] = "ACTIVE";
        TickMark[TickMark["INACTIVE"] = 1] = "INACTIVE";
    })(TickMark || (TickMark = {}));
    /**
     * Thumb types: range slider has two thumbs (START, END) whereas single point
     * slider only has one thumb (END).
     */
    var Thumb;
    (function (Thumb) {
        // Thumb at start of slider (e.g. in LTR mode, left thumb on range slider).
        Thumb[Thumb["START"] = 1] = "START";
        // Thumb at end of slider (e.g. in LTR mode, right thumb on range slider,
        // or only thumb on single point slider).
        Thumb[Thumb["END"] = 2] = "END";
    })(Thumb || (Thumb = {}));

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var AnimationKeys;
    (function (AnimationKeys) {
        AnimationKeys["SLIDER_UPDATE"] = "slider_update";
    })(AnimationKeys || (AnimationKeys = {}));
    // Accessing `window` without a `typeof` check will throw on Node environments.
    var HAS_WINDOW = typeof window !== 'undefined';
    /**
     * Foundation class for slider. Responsibilities include:
     * - Updating slider values (internal state and DOM updates) based on client
     *   'x' position.
     * - Updating DOM after slider property updates (e.g. min, max).
     */
    var MDCSliderFoundation = /** @class */ (function (_super) {
        __extends(MDCSliderFoundation, _super);
        function MDCSliderFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCSliderFoundation.defaultAdapter), adapter)) || this;
            // Whether the initial styles (to position the thumb, before component
            // initialization) have been removed.
            _this.initialStylesRemoved = false;
            _this.isDisabled = false;
            _this.isDiscrete = false;
            _this.step = numbers.STEP_SIZE;
            _this.minRange = numbers.MIN_RANGE;
            _this.hasTickMarks = false;
            // The following properties are only set for range sliders.
            _this.isRange = false;
            // Tracks the thumb being moved across a slider pointer interaction (down,
            // move event).
            _this.thumb = null;
            // `clientX` from the most recent down event. Used in subsequent move
            // events to determine which thumb to move (in the case of
            // overlapping thumbs).
            _this.downEventClientX = null;
            // Width of the start thumb knob.
            _this.startThumbKnobWidth = 0;
            // Width of the end thumb knob.
            _this.endThumbKnobWidth = 0;
            _this.animFrame = new AnimationFrame();
            return _this;
        }
        Object.defineProperty(MDCSliderFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same
                // order as the adapter interface.
                return {
                    hasClass: function () { return false; },
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    addThumbClass: function () { return undefined; },
                    removeThumbClass: function () { return undefined; },
                    getAttribute: function () { return null; },
                    getInputValue: function () { return ''; },
                    setInputValue: function () { return undefined; },
                    getInputAttribute: function () { return null; },
                    setInputAttribute: function () { return null; },
                    removeInputAttribute: function () { return null; },
                    focusInput: function () { return undefined; },
                    isInputFocused: function () { return false; },
                    shouldHideFocusStylesForPointerEvents: function () { return false; },
                    getThumbKnobWidth: function () { return 0; },
                    getValueIndicatorContainerWidth: function () { return 0; },
                    getThumbBoundingClientRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    getBoundingClientRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    isRTL: function () { return false; },
                    setThumbStyleProperty: function () { return undefined; },
                    removeThumbStyleProperty: function () { return undefined; },
                    setTrackActiveStyleProperty: function () { return undefined; },
                    removeTrackActiveStyleProperty: function () { return undefined; },
                    setValueIndicatorText: function () { return undefined; },
                    getValueToAriaValueTextFn: function () { return null; },
                    updateTickMarks: function () { return undefined; },
                    setPointerCapture: function () { return undefined; },
                    emitChangeEvent: function () { return undefined; },
                    emitInputEvent: function () { return undefined; },
                    emitDragStartEvent: function () { return undefined; },
                    emitDragEndEvent: function () { return undefined; },
                    registerEventHandler: function () { return undefined; },
                    deregisterEventHandler: function () { return undefined; },
                    registerThumbEventHandler: function () { return undefined; },
                    deregisterThumbEventHandler: function () { return undefined; },
                    registerInputEventHandler: function () { return undefined; },
                    deregisterInputEventHandler: function () { return undefined; },
                    registerBodyEventHandler: function () { return undefined; },
                    deregisterBodyEventHandler: function () { return undefined; },
                    registerWindowEventHandler: function () { return undefined; },
                    deregisterWindowEventHandler: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCSliderFoundation.prototype.init = function () {
            var _this = this;
            this.isDisabled = this.adapter.hasClass(cssClasses.DISABLED);
            this.isDiscrete = this.adapter.hasClass(cssClasses.DISCRETE);
            this.hasTickMarks = this.adapter.hasClass(cssClasses.TICK_MARKS);
            this.isRange = this.adapter.hasClass(cssClasses.RANGE);
            var min = this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_MIN, this.isRange ? Thumb.START : Thumb.END), attributes.INPUT_MIN);
            var max = this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_MAX, Thumb.END), attributes.INPUT_MAX);
            var value = this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_VALUE, Thumb.END), attributes.INPUT_VALUE);
            var valueStart = this.isRange ?
                this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_VALUE, Thumb.START), attributes.INPUT_VALUE) :
                min;
            var stepAttr = this.adapter.getInputAttribute(attributes.INPUT_STEP, Thumb.END);
            var step = stepAttr ?
                this.convertAttributeValueToNumber(stepAttr, attributes.INPUT_STEP) :
                this.step;
            var minRangeAttr = this.adapter.getAttribute(attributes.DATA_MIN_RANGE);
            var minRange = minRangeAttr ?
                this.convertAttributeValueToNumber(minRangeAttr, attributes.DATA_MIN_RANGE) :
                this.minRange;
            this.validateProperties({ min: min, max: max, value: value, valueStart: valueStart, step: step, minRange: minRange });
            this.min = min;
            this.max = max;
            this.value = value;
            this.valueStart = valueStart;
            this.step = step;
            this.minRange = minRange;
            this.numDecimalPlaces = getNumDecimalPlaces(this.step);
            this.valueBeforeDownEvent = value;
            this.valueStartBeforeDownEvent = valueStart;
            this.mousedownOrTouchstartListener =
                this.handleMousedownOrTouchstart.bind(this);
            this.moveListener = this.handleMove.bind(this);
            this.pointerdownListener = this.handlePointerdown.bind(this);
            this.pointerupListener = this.handlePointerup.bind(this);
            this.thumbMouseenterListener = this.handleThumbMouseenter.bind(this);
            this.thumbMouseleaveListener = this.handleThumbMouseleave.bind(this);
            this.inputStartChangeListener = function () {
                _this.handleInputChange(Thumb.START);
            };
            this.inputEndChangeListener = function () {
                _this.handleInputChange(Thumb.END);
            };
            this.inputStartFocusListener = function () {
                _this.handleInputFocus(Thumb.START);
            };
            this.inputEndFocusListener = function () {
                _this.handleInputFocus(Thumb.END);
            };
            this.inputStartBlurListener = function () {
                _this.handleInputBlur(Thumb.START);
            };
            this.inputEndBlurListener = function () {
                _this.handleInputBlur(Thumb.END);
            };
            this.resizeListener = this.handleResize.bind(this);
            this.registerEventHandlers();
        };
        MDCSliderFoundation.prototype.destroy = function () {
            this.deregisterEventHandlers();
        };
        MDCSliderFoundation.prototype.setMin = function (value) {
            this.min = value;
            if (!this.isRange) {
                this.valueStart = value;
            }
            this.updateUI();
        };
        MDCSliderFoundation.prototype.setMax = function (value) {
            this.max = value;
            this.updateUI();
        };
        MDCSliderFoundation.prototype.getMin = function () {
            return this.min;
        };
        MDCSliderFoundation.prototype.getMax = function () {
            return this.max;
        };
        /**
         * - For single point sliders, returns the thumb value.
         * - For range (two-thumb) sliders, returns the end thumb's value.
         */
        MDCSliderFoundation.prototype.getValue = function () {
            return this.value;
        };
        /**
         * - For single point sliders, sets the thumb value.
         * - For range (two-thumb) sliders, sets the end thumb's value.
         */
        MDCSliderFoundation.prototype.setValue = function (value) {
            if (this.isRange && value < this.valueStart + this.minRange) {
                throw new Error("end thumb value (" + value + ") must be >= start thumb " +
                    ("value (" + this.valueStart + ") + min range (" + this.minRange + ")"));
            }
            this.updateValue(value, Thumb.END);
        };
        /**
         * Only applicable for range sliders.
         * @return The start thumb's value.
         */
        MDCSliderFoundation.prototype.getValueStart = function () {
            if (!this.isRange) {
                throw new Error('`valueStart` is only applicable for range sliders.');
            }
            return this.valueStart;
        };
        /**
         * Only applicable for range sliders. Sets the start thumb's value.
         */
        MDCSliderFoundation.prototype.setValueStart = function (valueStart) {
            if (!this.isRange) {
                throw new Error('`valueStart` is only applicable for range sliders.');
            }
            if (this.isRange && valueStart > this.value - this.minRange) {
                throw new Error("start thumb value (" + valueStart + ") must be <= end thumb " +
                    ("value (" + this.value + ") - min range (" + this.minRange + ")"));
            }
            this.updateValue(valueStart, Thumb.START);
        };
        MDCSliderFoundation.prototype.setStep = function (value) {
            this.step = value;
            this.numDecimalPlaces = getNumDecimalPlaces(value);
            this.updateUI();
        };
        /**
         * Only applicable for range sliders. Sets the minimum difference between the
         * start and end values.
         */
        MDCSliderFoundation.prototype.setMinRange = function (value) {
            if (!this.isRange) {
                throw new Error('`minRange` is only applicable for range sliders.');
            }
            if (value < 0) {
                throw new Error('`minRange` must be non-negative. ' +
                    ("Current value: " + value));
            }
            if (this.value - this.valueStart < value) {
                throw new Error("start thumb value (" + this.valueStart + ") and end thumb value " +
                    ("(" + this.value + ") must differ by at least " + value + "."));
            }
            this.minRange = value;
        };
        MDCSliderFoundation.prototype.setIsDiscrete = function (value) {
            this.isDiscrete = value;
            this.updateValueIndicatorUI();
            this.updateTickMarksUI();
        };
        MDCSliderFoundation.prototype.getStep = function () {
            return this.step;
        };
        MDCSliderFoundation.prototype.getMinRange = function () {
            if (!this.isRange) {
                throw new Error('`minRange` is only applicable for range sliders.');
            }
            return this.minRange;
        };
        MDCSliderFoundation.prototype.setHasTickMarks = function (value) {
            this.hasTickMarks = value;
            this.updateTickMarksUI();
        };
        MDCSliderFoundation.prototype.getDisabled = function () {
            return this.isDisabled;
        };
        /**
         * Sets disabled state, including updating styles and thumb tabindex.
         */
        MDCSliderFoundation.prototype.setDisabled = function (disabled) {
            this.isDisabled = disabled;
            if (disabled) {
                this.adapter.addClass(cssClasses.DISABLED);
                if (this.isRange) {
                    this.adapter.setInputAttribute(attributes.INPUT_DISABLED, '', Thumb.START);
                }
                this.adapter.setInputAttribute(attributes.INPUT_DISABLED, '', Thumb.END);
            }
            else {
                this.adapter.removeClass(cssClasses.DISABLED);
                if (this.isRange) {
                    this.adapter.removeInputAttribute(attributes.INPUT_DISABLED, Thumb.START);
                }
                this.adapter.removeInputAttribute(attributes.INPUT_DISABLED, Thumb.END);
            }
        };
        /** @return Whether the slider is a range slider. */
        MDCSliderFoundation.prototype.getIsRange = function () {
            return this.isRange;
        };
        /**
         * - Syncs slider boundingClientRect with the current DOM.
         * - Updates UI based on internal state.
         */
        MDCSliderFoundation.prototype.layout = function (_a) {
            var _b = _a === void 0 ? {} : _a, skipUpdateUI = _b.skipUpdateUI;
            this.rect = this.adapter.getBoundingClientRect();
            if (this.isRange) {
                this.startThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.START);
                this.endThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.END);
            }
            if (!skipUpdateUI) {
                this.updateUI();
            }
        };
        /** Handles resize events on the window. */
        MDCSliderFoundation.prototype.handleResize = function () {
            this.layout();
        };
        /**
         * Handles pointer down events on the slider root element.
         */
        MDCSliderFoundation.prototype.handleDown = function (event) {
            if (this.isDisabled)
                return;
            this.valueStartBeforeDownEvent = this.valueStart;
            this.valueBeforeDownEvent = this.value;
            var clientX = event.clientX != null ?
                event.clientX :
                event.targetTouches[0].clientX;
            this.downEventClientX = clientX;
            var value = this.mapClientXOnSliderScale(clientX);
            this.thumb = this.getThumbFromDownEvent(clientX, value);
            if (this.thumb === null)
                return;
            this.handleDragStart(event, value, this.thumb);
            this.updateValue(value, this.thumb, { emitInputEvent: true });
        };
        /**
         * Handles pointer move events on the slider root element.
         */
        MDCSliderFoundation.prototype.handleMove = function (event) {
            if (this.isDisabled)
                return;
            // Prevent scrolling.
            event.preventDefault();
            var clientX = event.clientX != null ?
                event.clientX :
                event.targetTouches[0].clientX;
            var dragAlreadyStarted = this.thumb != null;
            this.thumb = this.getThumbFromMoveEvent(clientX);
            if (this.thumb === null)
                return;
            var value = this.mapClientXOnSliderScale(clientX);
            if (!dragAlreadyStarted) {
                this.handleDragStart(event, value, this.thumb);
                this.adapter.emitDragStartEvent(value, this.thumb);
            }
            this.updateValue(value, this.thumb, { emitInputEvent: true });
        };
        /**
         * Handles pointer up events on the slider root element.
         */
        MDCSliderFoundation.prototype.handleUp = function () {
            var _a, _b;
            if (this.isDisabled || this.thumb === null)
                return;
            // Remove the focused state and hide the value indicator(s) (if present)
            // if focus state is meant to be hidden.
            if ((_b = (_a = this.adapter).shouldHideFocusStylesForPointerEvents) === null || _b === void 0 ? void 0 : _b.call(_a)) {
                this.handleInputBlur(this.thumb);
            }
            var oldValue = this.thumb === Thumb.START ?
                this.valueStartBeforeDownEvent :
                this.valueBeforeDownEvent;
            var newValue = this.thumb === Thumb.START ? this.valueStart : this.value;
            if (oldValue !== newValue) {
                this.adapter.emitChangeEvent(newValue, this.thumb);
            }
            this.adapter.emitDragEndEvent(newValue, this.thumb);
            this.thumb = null;
        };
        /**
         * For range, discrete slider, shows the value indicator on both thumbs.
         */
        MDCSliderFoundation.prototype.handleThumbMouseenter = function () {
            if (!this.isDiscrete || !this.isRange)
                return;
            this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
            this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
        };
        /**
         * For range, discrete slider, hides the value indicator on both thumbs.
         */
        MDCSliderFoundation.prototype.handleThumbMouseleave = function () {
            var _a, _b;
            if (!this.isDiscrete || !this.isRange)
                return;
            if ((!((_b = (_a = this.adapter).shouldHideFocusStylesForPointerEvents) === null || _b === void 0 ? void 0 : _b.call(_a)) &&
                (this.adapter.isInputFocused(Thumb.START) ||
                    this.adapter.isInputFocused(Thumb.END))) ||
                this.thumb) {
                // Leave value indicator shown if either input is focused or the thumb is
                // being dragged.
                return;
            }
            this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
            this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
        };
        MDCSliderFoundation.prototype.handleMousedownOrTouchstart = function (event) {
            var _this = this;
            var moveEventType = event.type === 'mousedown' ? 'mousemove' : 'touchmove';
            // After a down event on the slider root, listen for move events on
            // body (so the slider value is updated for events outside of the
            // slider root).
            this.adapter.registerBodyEventHandler(moveEventType, this.moveListener);
            var upHandler = function () {
                _this.handleUp();
                // Once the drag is finished (up event on body), remove the move
                // handler.
                _this.adapter.deregisterBodyEventHandler(moveEventType, _this.moveListener);
                // Also stop listening for subsequent up events.
                _this.adapter.deregisterEventHandler('mouseup', upHandler);
                _this.adapter.deregisterEventHandler('touchend', upHandler);
            };
            this.adapter.registerBodyEventHandler('mouseup', upHandler);
            this.adapter.registerBodyEventHandler('touchend', upHandler);
            this.handleDown(event);
        };
        MDCSliderFoundation.prototype.handlePointerdown = function (event) {
            var isPrimaryButton = event.button === 0;
            if (!isPrimaryButton)
                return;
            if (event.pointerId != null) {
                this.adapter.setPointerCapture(event.pointerId);
            }
            this.adapter.registerEventHandler('pointermove', this.moveListener);
            this.handleDown(event);
        };
        /**
         * Handles input `change` event by setting internal slider value to match
         * input's new value.
         */
        MDCSliderFoundation.prototype.handleInputChange = function (thumb) {
            var value = Number(this.adapter.getInputValue(thumb));
            if (thumb === Thumb.START) {
                this.setValueStart(value);
            }
            else {
                this.setValue(value);
            }
            this.adapter.emitChangeEvent(thumb === Thumb.START ? this.valueStart : this.value, thumb);
            this.adapter.emitInputEvent(thumb === Thumb.START ? this.valueStart : this.value, thumb);
        };
        /** Shows activated state and value indicator on thumb(s). */
        MDCSliderFoundation.prototype.handleInputFocus = function (thumb) {
            this.adapter.addThumbClass(cssClasses.THUMB_FOCUSED, thumb);
            if (!this.isDiscrete)
                return;
            this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, thumb);
            if (this.isRange) {
                var otherThumb = thumb === Thumb.START ? Thumb.END : Thumb.START;
                this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, otherThumb);
            }
        };
        /** Removes activated state and value indicator from thumb(s). */
        MDCSliderFoundation.prototype.handleInputBlur = function (thumb) {
            this.adapter.removeThumbClass(cssClasses.THUMB_FOCUSED, thumb);
            if (!this.isDiscrete)
                return;
            this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, thumb);
            if (this.isRange) {
                var otherThumb = thumb === Thumb.START ? Thumb.END : Thumb.START;
                this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, otherThumb);
            }
        };
        /**
         * Emits custom dragStart event, along with focusing the underlying input.
         */
        MDCSliderFoundation.prototype.handleDragStart = function (event, value, thumb) {
            var _a, _b;
            this.adapter.emitDragStartEvent(value, thumb);
            this.adapter.focusInput(thumb);
            // Restore focused state and show the value indicator(s) (if present)
            // in case they were previously hidden on dragEnd.
            // This is needed if the input is already focused, in which case
            // #focusInput above wouldn't actually trigger #handleInputFocus,
            // which is why we need to invoke it manually here.
            if ((_b = (_a = this.adapter).shouldHideFocusStylesForPointerEvents) === null || _b === void 0 ? void 0 : _b.call(_a)) {
                this.handleInputFocus(thumb);
            }
            // Prevent the input (that we just focused) from losing focus.
            event.preventDefault();
        };
        /**
         * @return The thumb to be moved based on initial down event.
         */
        MDCSliderFoundation.prototype.getThumbFromDownEvent = function (clientX, value) {
            // For single point slider, thumb to be moved is always the END (only)
            // thumb.
            if (!this.isRange)
                return Thumb.END;
            // Check if event press point is in the bounds of any thumb.
            var thumbStartRect = this.adapter.getThumbBoundingClientRect(Thumb.START);
            var thumbEndRect = this.adapter.getThumbBoundingClientRect(Thumb.END);
            var inThumbStartBounds = clientX >= thumbStartRect.left && clientX <= thumbStartRect.right;
            var inThumbEndBounds = clientX >= thumbEndRect.left && clientX <= thumbEndRect.right;
            if (inThumbStartBounds && inThumbEndBounds) {
                // Thumbs overlapping. Thumb to be moved cannot be determined yet.
                return null;
            }
            // If press is in bounds for either thumb on down event, that's the thumb
            // to be moved.
            if (inThumbStartBounds) {
                return Thumb.START;
            }
            if (inThumbEndBounds) {
                return Thumb.END;
            }
            // For presses outside the range, return whichever thumb is closer.
            if (value < this.valueStart) {
                return Thumb.START;
            }
            if (value > this.value) {
                return Thumb.END;
            }
            // For presses inside the range, return whichever thumb is closer.
            return (value - this.valueStart <= this.value - value) ? Thumb.START :
                Thumb.END;
        };
        /**
         * @return The thumb to be moved based on move event (based on drag
         *     direction from original down event). Only applicable if thumbs
         *     were overlapping in the down event.
         */
        MDCSliderFoundation.prototype.getThumbFromMoveEvent = function (clientX) {
            // Thumb has already been chosen.
            if (this.thumb !== null)
                return this.thumb;
            if (this.downEventClientX === null) {
                throw new Error('`downEventClientX` is null after move event.');
            }
            var moveDistanceUnderThreshold = Math.abs(this.downEventClientX - clientX) < numbers.THUMB_UPDATE_MIN_PX;
            if (moveDistanceUnderThreshold)
                return this.thumb;
            var draggedThumbToLeft = clientX < this.downEventClientX;
            if (draggedThumbToLeft) {
                return this.adapter.isRTL() ? Thumb.END : Thumb.START;
            }
            else {
                return this.adapter.isRTL() ? Thumb.START : Thumb.END;
            }
        };
        /**
         * Updates UI based on internal state.
         * @param thumb Thumb whose value is being updated. If undefined, UI is
         *     updated for both thumbs based on current internal state.
         */
        MDCSliderFoundation.prototype.updateUI = function (thumb) {
            if (thumb) {
                this.updateThumbAndInputAttributes(thumb);
            }
            else {
                this.updateThumbAndInputAttributes(Thumb.START);
                this.updateThumbAndInputAttributes(Thumb.END);
            }
            this.updateThumbAndTrackUI(thumb);
            this.updateValueIndicatorUI(thumb);
            this.updateTickMarksUI();
        };
        /**
         * Updates thumb and input attributes based on current value.
         * @param thumb Thumb whose aria attributes to update.
         */
        MDCSliderFoundation.prototype.updateThumbAndInputAttributes = function (thumb) {
            if (!thumb)
                return;
            var value = this.isRange && thumb === Thumb.START ? this.valueStart : this.value;
            var valueStr = String(value);
            this.adapter.setInputAttribute(attributes.INPUT_VALUE, valueStr, thumb);
            if (this.isRange && thumb === Thumb.START) {
                this.adapter.setInputAttribute(attributes.INPUT_MIN, String(value + this.minRange), Thumb.END);
            }
            else if (this.isRange && thumb === Thumb.END) {
                this.adapter.setInputAttribute(attributes.INPUT_MAX, String(value - this.minRange), Thumb.START);
            }
            // Sync attribute with property.
            if (this.adapter.getInputValue(thumb) !== valueStr) {
                this.adapter.setInputValue(valueStr, thumb);
            }
            var valueToAriaValueTextFn = this.adapter.getValueToAriaValueTextFn();
            if (valueToAriaValueTextFn) {
                this.adapter.setInputAttribute(attributes.ARIA_VALUETEXT, valueToAriaValueTextFn(value, thumb), thumb);
            }
        };
        /**
         * Updates value indicator UI based on current value.
         * @param thumb Thumb whose value indicator to update. If undefined, all
         *     thumbs' value indicators are updated.
         */
        MDCSliderFoundation.prototype.updateValueIndicatorUI = function (thumb) {
            if (!this.isDiscrete)
                return;
            var value = this.isRange && thumb === Thumb.START ? this.valueStart : this.value;
            this.adapter.setValueIndicatorText(value, thumb === Thumb.START ? Thumb.START : Thumb.END);
            if (!thumb && this.isRange) {
                this.adapter.setValueIndicatorText(this.valueStart, Thumb.START);
            }
        };
        /**
         * Updates tick marks UI within slider, based on current min, max, and step.
         */
        MDCSliderFoundation.prototype.updateTickMarksUI = function () {
            if (!this.isDiscrete || !this.hasTickMarks)
                return;
            var numTickMarksInactiveStart = (this.valueStart - this.min) / this.step;
            var numTickMarksActive = (this.value - this.valueStart) / this.step + 1;
            var numTickMarksInactiveEnd = (this.max - this.value) / this.step;
            var tickMarksInactiveStart = Array.from({ length: numTickMarksInactiveStart })
                .fill(TickMark.INACTIVE);
            var tickMarksActive = Array.from({ length: numTickMarksActive })
                .fill(TickMark.ACTIVE);
            var tickMarksInactiveEnd = Array.from({ length: numTickMarksInactiveEnd })
                .fill(TickMark.INACTIVE);
            this.adapter.updateTickMarks(tickMarksInactiveStart.concat(tickMarksActive)
                .concat(tickMarksInactiveEnd));
        };
        /** Maps clientX to a value on the slider scale. */
        MDCSliderFoundation.prototype.mapClientXOnSliderScale = function (clientX) {
            var xPos = clientX - this.rect.left;
            var pctComplete = xPos / this.rect.width;
            if (this.adapter.isRTL()) {
                pctComplete = 1 - pctComplete;
            }
            // Fit the percentage complete between the range [min,max]
            // by remapping from [0, 1] to [min, min+(max-min)].
            var value = this.min + pctComplete * (this.max - this.min);
            if (value === this.max || value === this.min) {
                return value;
            }
            return Number(this.quantize(value).toFixed(this.numDecimalPlaces));
        };
        /** Calculates the quantized value based on step value. */
        MDCSliderFoundation.prototype.quantize = function (value) {
            var numSteps = Math.round((value - this.min) / this.step);
            return this.min + numSteps * this.step;
        };
        /**
         * Updates slider value (internal state and UI) based on the given value.
         */
        MDCSliderFoundation.prototype.updateValue = function (value, thumb, _a) {
            var _b = _a === void 0 ? {} : _a, emitInputEvent = _b.emitInputEvent;
            value = this.clampValue(value, thumb);
            if (this.isRange && thumb === Thumb.START) {
                // Exit early if current value is the same as the new value.
                if (this.valueStart === value)
                    return;
                this.valueStart = value;
            }
            else {
                // Exit early if current value is the same as the new value.
                if (this.value === value)
                    return;
                this.value = value;
            }
            this.updateUI(thumb);
            if (emitInputEvent) {
                this.adapter.emitInputEvent(thumb === Thumb.START ? this.valueStart : this.value, thumb);
            }
        };
        /**
         * Clamps the given value for the given thumb based on slider properties:
         * - Restricts value within [min, max].
         * - If range slider, clamp start value <= end value - min range, and
         *   end value >= start value + min range.
         */
        MDCSliderFoundation.prototype.clampValue = function (value, thumb) {
            // Clamp value to [min, max] range.
            value = Math.min(Math.max(value, this.min), this.max);
            var thumbStartMovedPastThumbEnd = this.isRange && thumb === Thumb.START &&
                value > this.value - this.minRange;
            if (thumbStartMovedPastThumbEnd) {
                return this.value - this.minRange;
            }
            var thumbEndMovedPastThumbStart = this.isRange && thumb === Thumb.END &&
                value < this.valueStart + this.minRange;
            if (thumbEndMovedPastThumbStart) {
                return this.valueStart + this.minRange;
            }
            return value;
        };
        /**
         * Updates the active track and thumb style properties to reflect current
         * value.
         */
        MDCSliderFoundation.prototype.updateThumbAndTrackUI = function (thumb) {
            var _this = this;
            var _a = this, max = _a.max, min = _a.min;
            var pctComplete = (this.value - this.valueStart) / (max - min);
            var rangePx = pctComplete * this.rect.width;
            var isRtl = this.adapter.isRTL();
            var transformProp = HAS_WINDOW ? getCorrectPropertyName(window, 'transform') : 'transform';
            if (this.isRange) {
                var thumbLeftPos_1 = this.adapter.isRTL() ?
                    (max - this.value) / (max - min) * this.rect.width :
                    (this.valueStart - min) / (max - min) * this.rect.width;
                var thumbRightPos_1 = thumbLeftPos_1 + rangePx;
                this.animFrame.request(AnimationKeys.SLIDER_UPDATE, function () {
                    // Set active track styles, accounting for animation direction by
                    // setting `transform-origin`.
                    var trackAnimatesFromRight = (!isRtl && thumb === Thumb.START) ||
                        (isRtl && thumb !== Thumb.START);
                    if (trackAnimatesFromRight) {
                        _this.adapter.setTrackActiveStyleProperty('transform-origin', 'right');
                        _this.adapter.setTrackActiveStyleProperty('left', 'auto');
                        _this.adapter.setTrackActiveStyleProperty('right', _this.rect.width - thumbRightPos_1 + "px");
                    }
                    else {
                        _this.adapter.setTrackActiveStyleProperty('transform-origin', 'left');
                        _this.adapter.setTrackActiveStyleProperty('right', 'auto');
                        _this.adapter.setTrackActiveStyleProperty('left', thumbLeftPos_1 + "px");
                    }
                    _this.adapter.setTrackActiveStyleProperty(transformProp, "scaleX(" + pctComplete + ")");
                    // Set thumb styles.
                    var thumbStartPos = isRtl ? thumbRightPos_1 : thumbLeftPos_1;
                    var thumbEndPos = _this.adapter.isRTL() ? thumbLeftPos_1 : thumbRightPos_1;
                    if (thumb === Thumb.START || !thumb || !_this.initialStylesRemoved) {
                        _this.adapter.setThumbStyleProperty(transformProp, "translateX(" + thumbStartPos + "px)", Thumb.START);
                        _this.alignValueIndicator(Thumb.START, thumbStartPos);
                    }
                    if (thumb === Thumb.END || !thumb || !_this.initialStylesRemoved) {
                        _this.adapter.setThumbStyleProperty(transformProp, "translateX(" + thumbEndPos + "px)", Thumb.END);
                        _this.alignValueIndicator(Thumb.END, thumbEndPos);
                    }
                    _this.removeInitialStyles(isRtl);
                    _this.updateOverlappingThumbsUI(thumbStartPos, thumbEndPos, thumb);
                });
            }
            else {
                this.animFrame.request(AnimationKeys.SLIDER_UPDATE, function () {
                    var thumbStartPos = isRtl ? _this.rect.width - rangePx : rangePx;
                    _this.adapter.setThumbStyleProperty(transformProp, "translateX(" + thumbStartPos + "px)", Thumb.END);
                    _this.alignValueIndicator(Thumb.END, thumbStartPos);
                    _this.adapter.setTrackActiveStyleProperty(transformProp, "scaleX(" + pctComplete + ")");
                    _this.removeInitialStyles(isRtl);
                });
            }
        };
        /**
         * Shifts the value indicator to either side if it would otherwise stick
         * beyond the slider's length while keeping the caret above the knob.
         */
        MDCSliderFoundation.prototype.alignValueIndicator = function (thumb, thumbPos) {
            if (!this.isDiscrete)
                return;
            var thumbHalfWidth = this.adapter.getThumbBoundingClientRect(thumb).width / 2;
            var containerWidth = this.adapter.getValueIndicatorContainerWidth(thumb);
            var sliderWidth = this.adapter.getBoundingClientRect().width;
            if (containerWidth / 2 > thumbPos + thumbHalfWidth) {
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_LEFT, thumbHalfWidth + "px", thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_TRANSFORM, 'translateX(-50%)', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_LEFT, '0', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM, 'none', thumb);
            }
            else if (containerWidth / 2 > sliderWidth - thumbPos + thumbHalfWidth) {
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_LEFT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_RIGHT, thumbHalfWidth + "px", thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_TRANSFORM, 'translateX(50%)', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_LEFT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_RIGHT, '0', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM, 'none', thumb);
            }
            else {
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_LEFT, '50%', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_TRANSFORM, 'translateX(-50%)', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_LEFT, '50%', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM, 'translateX(-50%)', thumb);
            }
        };
        /**
         * Removes initial inline styles if not already removed. `left:<...>%`
         * inline styles can be added to position the thumb correctly before JS
         * initialization. However, they need to be removed before the JS starts
         * positioning the thumb. This is because the JS uses
         * `transform:translateX(<...>)px` (for performance reasons) to position
         * the thumb (which is not possible for initial styles since we need the
         * bounding rect measurements).
         */
        MDCSliderFoundation.prototype.removeInitialStyles = function (isRtl) {
            if (this.initialStylesRemoved)
                return;
            // Remove thumb position properties that were added for initial render.
            var position = isRtl ? 'right' : 'left';
            this.adapter.removeThumbStyleProperty(position, Thumb.END);
            if (this.isRange) {
                this.adapter.removeThumbStyleProperty(position, Thumb.START);
            }
            this.initialStylesRemoved = true;
            this.resetTrackAndThumbAnimation();
        };
        /**
         * Resets track/thumb animation to prevent animation when adding
         * `transform` styles to thumb initially.
         */
        MDCSliderFoundation.prototype.resetTrackAndThumbAnimation = function () {
            var _this = this;
            if (!this.isDiscrete)
                return;
            // Set transition properties to default (no animation), so that the
            // newly added `transform` styles do not animate thumb/track from
            // their default positions.
            var transitionProp = HAS_WINDOW ?
                getCorrectPropertyName(window, 'transition') :
                'transition';
            var transitionDefault = 'none 0s ease 0s';
            this.adapter.setThumbStyleProperty(transitionProp, transitionDefault, Thumb.END);
            if (this.isRange) {
                this.adapter.setThumbStyleProperty(transitionProp, transitionDefault, Thumb.START);
            }
            this.adapter.setTrackActiveStyleProperty(transitionProp, transitionDefault);
            // In the next frame, remove the transition inline styles we just
            // added, such that any animations added in the CSS can now take effect.
            requestAnimationFrame(function () {
                _this.adapter.removeThumbStyleProperty(transitionProp, Thumb.END);
                _this.adapter.removeTrackActiveStyleProperty(transitionProp);
                if (_this.isRange) {
                    _this.adapter.removeThumbStyleProperty(transitionProp, Thumb.START);
                }
            });
        };
        /**
         * Adds THUMB_TOP class to active thumb if thumb knobs overlap; otherwise
         * removes THUMB_TOP class from both thumbs.
         * @param thumb Thumb that is active (being moved).
         */
        MDCSliderFoundation.prototype.updateOverlappingThumbsUI = function (thumbStartPos, thumbEndPos, thumb) {
            var thumbsOverlap = false;
            if (this.adapter.isRTL()) {
                var startThumbLeftEdge = thumbStartPos - this.startThumbKnobWidth / 2;
                var endThumbRightEdge = thumbEndPos + this.endThumbKnobWidth / 2;
                thumbsOverlap = endThumbRightEdge >= startThumbLeftEdge;
            }
            else {
                var startThumbRightEdge = thumbStartPos + this.startThumbKnobWidth / 2;
                var endThumbLeftEdge = thumbEndPos - this.endThumbKnobWidth / 2;
                thumbsOverlap = startThumbRightEdge >= endThumbLeftEdge;
            }
            if (thumbsOverlap) {
                this.adapter.addThumbClass(cssClasses.THUMB_TOP, 
                // If no thumb was dragged (in the case of initial layout), end
                // thumb is on top by default.
                thumb || Thumb.END);
                this.adapter.removeThumbClass(cssClasses.THUMB_TOP, thumb === Thumb.START ? Thumb.END : Thumb.START);
            }
            else {
                this.adapter.removeThumbClass(cssClasses.THUMB_TOP, Thumb.START);
                this.adapter.removeThumbClass(cssClasses.THUMB_TOP, Thumb.END);
            }
        };
        /**
         * Converts attribute value to a number, e.g. '100' => 100. Throws errors
         * for invalid values.
         * @param attributeValue Attribute value, e.g. 100.
         * @param attributeName Attribute name, e.g. `aria-valuemax`.
         */
        MDCSliderFoundation.prototype.convertAttributeValueToNumber = function (attributeValue, attributeName) {
            if (attributeValue === null) {
                throw new Error('MDCSliderFoundation: `' + attributeName + '` must be non-null.');
            }
            var value = Number(attributeValue);
            if (isNaN(value)) {
                throw new Error('MDCSliderFoundation: `' + attributeName + '` value is `' +
                    attributeValue + '`, but must be a number.');
            }
            return value;
        };
        /** Checks that the given properties are valid slider values. */
        MDCSliderFoundation.prototype.validateProperties = function (_a) {
            var min = _a.min, max = _a.max, value = _a.value, valueStart = _a.valueStart, step = _a.step, minRange = _a.minRange;
            if (min >= max) {
                throw new Error("MDCSliderFoundation: min must be strictly less than max. " +
                    ("Current: [min: " + min + ", max: " + max + "]"));
            }
            if (step <= 0) {
                throw new Error("MDCSliderFoundation: step must be a positive number. " +
                    ("Current step: " + step));
            }
            if (this.isRange) {
                if (value < min || value > max || valueStart < min || valueStart > max) {
                    throw new Error("MDCSliderFoundation: values must be in [min, max] range. " +
                        ("Current values: [start value: " + valueStart + ", end value: ") +
                        (value + ", min: " + min + ", max: " + max + "]"));
                }
                if (valueStart > value) {
                    throw new Error("MDCSliderFoundation: start value must be <= end value. " +
                        ("Current values: [start value: " + valueStart + ", end value: " + value + "]"));
                }
                if (minRange < 0) {
                    throw new Error("MDCSliderFoundation: minimum range must be non-negative. " +
                        ("Current min range: " + minRange));
                }
                if (value - valueStart < minRange) {
                    throw new Error("MDCSliderFoundation: start value and end value must differ by at least " +
                        (minRange + ". Current values: [start value: " + valueStart + ", ") +
                        ("end value: " + value + "]"));
                }
                var numStepsValueStartFromMin = (valueStart - min) / step;
                var numStepsValueFromMin = (value - min) / step;
                if (!Number.isInteger(parseFloat(numStepsValueStartFromMin.toFixed(6))) ||
                    !Number.isInteger(parseFloat(numStepsValueFromMin.toFixed(6)))) {
                    throw new Error("MDCSliderFoundation: Slider values must be valid based on the " +
                        ("step value (" + step + "). Current values: [start value: ") +
                        (valueStart + ", end value: " + value + ", min: " + min + "]"));
                }
            }
            else { // Single point slider.
                if (value < min || value > max) {
                    throw new Error("MDCSliderFoundation: value must be in [min, max] range. " +
                        ("Current values: [value: " + value + ", min: " + min + ", max: " + max + "]"));
                }
                var numStepsValueFromMin = (value - min) / step;
                if (!Number.isInteger(parseFloat(numStepsValueFromMin.toFixed(6)))) {
                    throw new Error("MDCSliderFoundation: Slider value must be valid based on the " +
                        ("step value (" + step + "). Current value: " + value));
                }
            }
        };
        MDCSliderFoundation.prototype.registerEventHandlers = function () {
            this.adapter.registerWindowEventHandler('resize', this.resizeListener);
            if (MDCSliderFoundation.SUPPORTS_POINTER_EVENTS) {
                // If supported, use pointer events API with #setPointerCapture.
                this.adapter.registerEventHandler('pointerdown', this.pointerdownListener);
                this.adapter.registerEventHandler('pointerup', this.pointerupListener);
            }
            else {
                // Otherwise, fall back to mousedown/touchstart events.
                this.adapter.registerEventHandler('mousedown', this.mousedownOrTouchstartListener);
                this.adapter.registerEventHandler('touchstart', this.mousedownOrTouchstartListener);
            }
            if (this.isRange) {
                this.adapter.registerThumbEventHandler(Thumb.START, 'mouseenter', this.thumbMouseenterListener);
                this.adapter.registerThumbEventHandler(Thumb.START, 'mouseleave', this.thumbMouseleaveListener);
                this.adapter.registerInputEventHandler(Thumb.START, 'change', this.inputStartChangeListener);
                this.adapter.registerInputEventHandler(Thumb.START, 'focus', this.inputStartFocusListener);
                this.adapter.registerInputEventHandler(Thumb.START, 'blur', this.inputStartBlurListener);
            }
            this.adapter.registerThumbEventHandler(Thumb.END, 'mouseenter', this.thumbMouseenterListener);
            this.adapter.registerThumbEventHandler(Thumb.END, 'mouseleave', this.thumbMouseleaveListener);
            this.adapter.registerInputEventHandler(Thumb.END, 'change', this.inputEndChangeListener);
            this.adapter.registerInputEventHandler(Thumb.END, 'focus', this.inputEndFocusListener);
            this.adapter.registerInputEventHandler(Thumb.END, 'blur', this.inputEndBlurListener);
        };
        MDCSliderFoundation.prototype.deregisterEventHandlers = function () {
            this.adapter.deregisterWindowEventHandler('resize', this.resizeListener);
            if (MDCSliderFoundation.SUPPORTS_POINTER_EVENTS) {
                this.adapter.deregisterEventHandler('pointerdown', this.pointerdownListener);
                this.adapter.deregisterEventHandler('pointerup', this.pointerupListener);
            }
            else {
                this.adapter.deregisterEventHandler('mousedown', this.mousedownOrTouchstartListener);
                this.adapter.deregisterEventHandler('touchstart', this.mousedownOrTouchstartListener);
            }
            if (this.isRange) {
                this.adapter.deregisterThumbEventHandler(Thumb.START, 'mouseenter', this.thumbMouseenterListener);
                this.adapter.deregisterThumbEventHandler(Thumb.START, 'mouseleave', this.thumbMouseleaveListener);
                this.adapter.deregisterInputEventHandler(Thumb.START, 'change', this.inputStartChangeListener);
                this.adapter.deregisterInputEventHandler(Thumb.START, 'focus', this.inputStartFocusListener);
                this.adapter.deregisterInputEventHandler(Thumb.START, 'blur', this.inputStartBlurListener);
            }
            this.adapter.deregisterThumbEventHandler(Thumb.END, 'mouseenter', this.thumbMouseenterListener);
            this.adapter.deregisterThumbEventHandler(Thumb.END, 'mouseleave', this.thumbMouseleaveListener);
            this.adapter.deregisterInputEventHandler(Thumb.END, 'change', this.inputEndChangeListener);
            this.adapter.deregisterInputEventHandler(Thumb.END, 'focus', this.inputEndFocusListener);
            this.adapter.deregisterInputEventHandler(Thumb.END, 'blur', this.inputEndBlurListener);
        };
        MDCSliderFoundation.prototype.handlePointerup = function () {
            this.handleUp();
            this.adapter.deregisterEventHandler('pointermove', this.moveListener);
        };
        MDCSliderFoundation.SUPPORTS_POINTER_EVENTS = HAS_WINDOW && Boolean(window.PointerEvent) &&
            // #setPointerCapture is buggy on iOS, so we can't use pointer events
            // until the following bug is fixed:
            // https://bugs.webkit.org/show_bug.cgi?id=220196
            !isIOS();
        return MDCSliderFoundation;
    }(MDCFoundation));
    function isIOS() {
        // Source:
        // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
        return [
            'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    }
    /**
     * Given a number, returns the number of digits that appear after the
     * decimal point.
     * See
     * https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
     */
    function getNumDecimalPlaces(n) {
        // Pull out the fraction and the exponent.
        var match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(String(n));
        // NaN or Infinity or integer.
        // We arbitrarily decide that Infinity is integral.
        if (!match)
            return 0;
        var fraction = match[1] || ''; // E.g. 1.234e-2 => 234
        var exponent = match[2] || 0; // E.g. 1.234e-2 => -2
        // Count the number of digits in the fraction and subtract the
        // exponent to simulate moving the decimal point left by exponent places.
        // 1.234e+2 has 1 fraction digit and '234'.length -  2 == 1
        // 1.234e-2 has 5 fraction digit and '234'.length - -2 == 5
        return Math.max(0, // lower limit
        (fraction === '0' ? 0 : fraction.length) - Number(exponent));
    }

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
    /** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
    duplicateEventForMDC = false) {
        if (typeof Event !== 'undefined' && element) {
            const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
            if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
                const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
                element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
                if (duplicateEvent.defaultPrevented) {
                    event.preventDefault();
                }
            }
            return event;
        }
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = parts.slice(1).reduce((obj, mod) => {
                        obj[mod] = true;
                        return obj;
                    }, {});
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules/@smui/slider/dist/Slider.svelte generated by Svelte v3.55.1 */
    const file$8 = "node_modules/@smui/slider/dist/Slider.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[92] = list[i];
    	return child_ctx;
    }

    // (56:2) {:else}
    function create_else_block_1(ctx) {
    	let input_1;
    	let input_1_class_value;
    	let mounted;
    	let dispose;

    	let input_1_levels = [
    		{
    			class: input_1_class_value = classMap({
    				[/*input$class*/ ctx[13]]: true,
    				'mdc-slider__input': true
    			})
    		},
    		{ type: "range" },
    		{ disabled: /*disabled*/ ctx[5] },
    		{ step: /*step*/ ctx[9] },
    		{ min: /*min*/ ctx[10] },
    		{ max: /*max*/ ctx[11] },
    		/*inputProps*/ ctx[33],
    		/*inputAttrs*/ ctx[24],
    		prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    	];

    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			set_attributes(input_1, input_1_data);
    			add_location(input_1, file$8, 56, 4, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			if (input_1.autofocus) input_1.focus();
    			/*input_1_binding*/ ctx[62](input_1);
    			set_input_value(input_1, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "change", /*input_1_change_input_handler*/ ctx[63]),
    					listen_dev(input_1, "input", /*input_1_change_input_handler*/ ctx[63]),
    					listen_dev(input_1, "blur", /*blur_handler_2*/ ctx[56], false, false, false),
    					listen_dev(input_1, "focus", /*focus_handler_2*/ ctx[57], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [
    				dirty[0] & /*input$class*/ 8192 && input_1_class_value !== (input_1_class_value = classMap({
    					[/*input$class*/ ctx[13]]: true,
    					'mdc-slider__input': true
    				})) && { class: input_1_class_value },
    				{ type: "range" },
    				dirty[0] & /*disabled*/ 32 && { disabled: /*disabled*/ ctx[5] },
    				dirty[0] & /*step*/ 512 && { step: /*step*/ ctx[9] },
    				dirty[0] & /*min*/ 1024 && { min: /*min*/ ctx[10] },
    				dirty[0] & /*max*/ 2048 && { max: /*max*/ ctx[11] },
    				/*inputProps*/ ctx[33],
    				dirty[0] & /*inputAttrs*/ 16777216 && /*inputAttrs*/ ctx[24],
    				dirty[1] & /*$$restProps*/ 64 && prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    			]));

    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input_1, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			/*input_1_binding*/ ctx[62](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(56:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if range}
    function create_if_block_5(ctx) {
    	let input0;
    	let input0_class_value;
    	let t;
    	let input1;
    	let input1_class_value;
    	let mounted;
    	let dispose;

    	let input0_levels = [
    		{
    			class: input0_class_value = classMap({
    				[/*input$class*/ ctx[13]]: true,
    				'mdc-slider__input': true
    			})
    		},
    		{ type: "range" },
    		{ disabled: /*disabled*/ ctx[5] },
    		{ step: /*step*/ ctx[9] },
    		{ min: /*min*/ ctx[10] },
    		{ max: /*end*/ ctx[2] },
    		/*inputStartAttrs*/ ctx[25],
    		prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    	];

    	let input0_data = {};

    	for (let i = 0; i < input0_levels.length; i += 1) {
    		input0_data = assign(input0_data, input0_levels[i]);
    	}

    	let input1_levels = [
    		{
    			class: input1_class_value = classMap({
    				[/*input$class*/ ctx[13]]: true,
    				'mdc-slider__input': true
    			})
    		},
    		{ type: "range" },
    		{ disabled: /*disabled*/ ctx[5] },
    		{ step: /*step*/ ctx[9] },
    		{ min: /*start*/ ctx[1] },
    		{ max: /*max*/ ctx[11] },
    		/*inputProps*/ ctx[33],
    		/*inputAttrs*/ ctx[24],
    		prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    	];

    	let input1_data = {};

    	for (let i = 0; i < input1_levels.length; i += 1) {
    		input1_data = assign(input1_data, input1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			set_attributes(input0, input0_data);
    			add_location(input0, file$8, 20, 4, 545);
    			set_attributes(input1, input1_data);
    			add_location(input1, file$8, 37, 4, 895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			if (input0.autofocus) input0.focus();
    			/*input0_binding*/ ctx[58](input0);
    			set_input_value(input0, /*start*/ ctx[1]);
    			insert_dev(target, t, anchor);
    			insert_dev(target, input1, anchor);
    			if (input1.autofocus) input1.focus();
    			/*input1_binding*/ ctx[60](input1);
    			set_input_value(input1, /*end*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[59]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[59]),
    					listen_dev(input0, "blur", /*blur_handler*/ ctx[54], false, false, false),
    					listen_dev(input0, "focus", /*focus_handler*/ ctx[55], false, false, false),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[61]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[61]),
    					listen_dev(input1, "blur", /*blur_handler_1*/ ctx[52], false, false, false),
    					listen_dev(input1, "focus", /*focus_handler_1*/ ctx[53], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input0, input0_data = get_spread_update(input0_levels, [
    				dirty[0] & /*input$class*/ 8192 && input0_class_value !== (input0_class_value = classMap({
    					[/*input$class*/ ctx[13]]: true,
    					'mdc-slider__input': true
    				})) && { class: input0_class_value },
    				{ type: "range" },
    				dirty[0] & /*disabled*/ 32 && { disabled: /*disabled*/ ctx[5] },
    				dirty[0] & /*step*/ 512 && { step: /*step*/ ctx[9] },
    				dirty[0] & /*min*/ 1024 && { min: /*min*/ ctx[10] },
    				dirty[0] & /*end*/ 4 && { max: /*end*/ ctx[2] },
    				dirty[0] & /*inputStartAttrs*/ 33554432 && /*inputStartAttrs*/ ctx[25],
    				dirty[1] & /*$$restProps*/ 64 && prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    			]));

    			if (dirty[0] & /*start*/ 2) {
    				set_input_value(input0, /*start*/ ctx[1]);
    			}

    			set_attributes(input1, input1_data = get_spread_update(input1_levels, [
    				dirty[0] & /*input$class*/ 8192 && input1_class_value !== (input1_class_value = classMap({
    					[/*input$class*/ ctx[13]]: true,
    					'mdc-slider__input': true
    				})) && { class: input1_class_value },
    				{ type: "range" },
    				dirty[0] & /*disabled*/ 32 && { disabled: /*disabled*/ ctx[5] },
    				dirty[0] & /*step*/ 512 && { step: /*step*/ ctx[9] },
    				dirty[0] & /*start*/ 2 && { min: /*start*/ ctx[1] },
    				dirty[0] & /*max*/ 2048 && { max: /*max*/ ctx[11] },
    				/*inputProps*/ ctx[33],
    				dirty[0] & /*inputAttrs*/ 16777216 && /*inputAttrs*/ ctx[24],
    				dirty[1] & /*$$restProps*/ 64 && prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    			]));

    			if (dirty[0] & /*end*/ 4) {
    				set_input_value(input1, /*end*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			/*input0_binding*/ ctx[58](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(input1);
    			/*input1_binding*/ ctx[60](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(20:2) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (87:4) {#if discrete && tickMarks && step > 0}
    function create_if_block_4(ctx) {
    	let div;
    	let each_value = /*currentTickMarks*/ ctx[31];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "mdc-slider__tick-marks");
    			add_location(div, file$8, 87, 6, 2003);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*currentTickMarks*/ 1) {
    				each_value = /*currentTickMarks*/ ctx[31];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(87:4) {#if discrete && tickMarks && step > 0}",
    		ctx
    	});

    	return block;
    }

    // (89:8) {#each currentTickMarks as tickMark}
    function create_each_block$1(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");

    			attr_dev(div, "class", div_class_value = /*tickMark*/ ctx[92] === TickMark.ACTIVE
    			? 'mdc-slider__tick-mark--active'
    			: 'mdc-slider__tick-mark--inactive');

    			add_location(div, file$8, 89, 10, 2095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*currentTickMarks*/ 1 && div_class_value !== (div_class_value = /*tickMark*/ ctx[92] === TickMark.ACTIVE
    			? 'mdc-slider__tick-mark--active'
    			: 'mdc-slider__tick-mark--inactive')) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(89:8) {#each currentTickMarks as tickMark}",
    		ctx
    	});

    	return block;
    }

    // (158:2) {:else}
    function create_else_block$1(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let div1_class_value;
    	let div1_style_value;
    	let Ripple_action;
    	let mounted;
    	let dispose;
    	let if_block = /*discrete*/ ctx[7] && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "mdc-slider__thumb-knob");
    			add_location(div0, file$8, 185, 6, 5243);

    			attr_dev(div1, "class", div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}));

    			attr_dev(div1, "style", div1_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_3).join(' '));
    			add_location(div1, file$8, 158, 4, 4337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			/*div0_binding_1*/ ctx[74](div0);
    			/*div1_binding_1*/ ctx[75](div1);

    			if (!mounted) {
    				dispose = action_destroyer(Ripple_action = Ripple.call(null, div1, {
    					unbounded: true,
    					disabled: /*disabled*/ ctx[5],
    					active: /*thumbRippleActive*/ ctx[29],
    					eventTarget: /*input*/ ctx[15],
    					activeTarget: /*input*/ ctx[15],
    					addClass: /*Ripple_function_6*/ ctx[76],
    					removeClass: /*Ripple_function_7*/ ctx[77],
    					addStyle: /*Ripple_function_8*/ ctx[78]
    				}));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*discrete*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*thumbClasses*/ 8388608 && div1_class_value !== (div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*thumbStyles*/ 134217728 && div1_style_value !== (div1_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_3).join(' '))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*disabled, thumbRippleActive, input*/ 536903712) Ripple_action.update.call(null, {
    				unbounded: true,
    				disabled: /*disabled*/ ctx[5],
    				active: /*thumbRippleActive*/ ctx[29],
    				eventTarget: /*input*/ ctx[15],
    				activeTarget: /*input*/ ctx[15],
    				addClass: /*Ripple_function_6*/ ctx[76],
    				removeClass: /*Ripple_function_7*/ ctx[77],
    				addStyle: /*Ripple_function_8*/ ctx[78]
    			});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			/*div0_binding_1*/ ctx[74](null);
    			/*div1_binding_1*/ ctx[75](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(158:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:2) {#if range}
    function create_if_block$2(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let div1_class_value;
    	let div1_style_value;
    	let Ripple_action;
    	let t1;
    	let div3;
    	let t2;
    	let div2;
    	let div3_class_value;
    	let div3_style_value;
    	let Ripple_action_1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*discrete*/ ctx[7] && create_if_block_2$1(ctx);
    	let if_block1 = /*discrete*/ ctx[7] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "mdc-slider__thumb-knob");
    			add_location(div0, file$8, 126, 6, 3266);

    			attr_dev(div1, "class", div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbStartClasses*/ ctx[22]
    			}));

    			attr_dev(div1, "style", div1_style_value = Object.entries(/*thumbStartStyles*/ ctx[28]).map(func_1).join(' '));
    			add_location(div1, file$8, 99, 4, 2326);
    			attr_dev(div2, "class", "mdc-slider__thumb-knob");
    			add_location(div2, file$8, 155, 6, 4251);

    			attr_dev(div3, "class", div3_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}));

    			attr_dev(div3, "style", div3_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_2).join(' '));
    			add_location(div3, file$8, 128, 4, 3347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[64](div0);
    			/*div1_binding*/ ctx[65](div1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			/*div2_binding*/ ctx[69](div2);
    			/*div3_binding*/ ctx[70](div3);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, div1, {
    						unbounded: true,
    						disabled: /*disabled*/ ctx[5],
    						active: /*thumbStartRippleActive*/ ctx[30],
    						eventTarget: /*inputStart*/ ctx[16],
    						activeTarget: /*inputStart*/ ctx[16],
    						addClass: /*Ripple_function*/ ctx[66],
    						removeClass: /*Ripple_function_1*/ ctx[67],
    						addStyle: /*Ripple_function_2*/ ctx[68]
    					})),
    					action_destroyer(Ripple_action_1 = Ripple.call(null, div3, {
    						unbounded: true,
    						disabled: /*disabled*/ ctx[5],
    						active: /*thumbRippleActive*/ ctx[29],
    						eventTarget: /*input*/ ctx[15],
    						activeTarget: /*input*/ ctx[15],
    						addClass: /*Ripple_function_3*/ ctx[71],
    						removeClass: /*Ripple_function_4*/ ctx[72],
    						addStyle: /*Ripple_function_5*/ ctx[73]
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*discrete*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*thumbStartClasses*/ 4194304 && div1_class_value !== (div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbStartClasses*/ ctx[22]
    			}))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*thumbStartStyles*/ 268435456 && div1_style_value !== (div1_style_value = Object.entries(/*thumbStartStyles*/ ctx[28]).map(func_1).join(' '))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*disabled, thumbStartRippleActive, inputStart*/ 1073807392) Ripple_action.update.call(null, {
    				unbounded: true,
    				disabled: /*disabled*/ ctx[5],
    				active: /*thumbStartRippleActive*/ ctx[30],
    				eventTarget: /*inputStart*/ ctx[16],
    				activeTarget: /*inputStart*/ ctx[16],
    				addClass: /*Ripple_function*/ ctx[66],
    				removeClass: /*Ripple_function_1*/ ctx[67],
    				addStyle: /*Ripple_function_2*/ ctx[68]
    			});

    			if (/*discrete*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div3, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*thumbClasses*/ 8388608 && div3_class_value !== (div3_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (dirty[0] & /*thumbStyles*/ 134217728 && div3_style_value !== (div3_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_2).join(' '))) {
    				attr_dev(div3, "style", div3_style_value);
    			}

    			if (Ripple_action_1 && is_function(Ripple_action_1.update) && dirty[0] & /*disabled, thumbRippleActive, input*/ 536903712) Ripple_action_1.update.call(null, {
    				unbounded: true,
    				disabled: /*disabled*/ ctx[5],
    				active: /*thumbRippleActive*/ ctx[29],
    				eventTarget: /*input*/ ctx[15],
    				activeTarget: /*input*/ ctx[15],
    				addClass: /*Ripple_function_3*/ ctx[71],
    				removeClass: /*Ripple_function_4*/ ctx[72],
    				addStyle: /*Ripple_function_5*/ ctx[73]
    			});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			/*div0_binding*/ ctx[64](null);
    			/*div1_binding*/ ctx[65](null);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			if (if_block1) if_block1.d();
    			/*div2_binding*/ ctx[69](null);
    			/*div3_binding*/ ctx[70](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(99:2) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (179:6) {#if discrete}
    function create_if_block_3$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t = text(/*value*/ ctx[0]);
    			attr_dev(span, "class", "mdc-slider__value-indicator-text");
    			add_location(span, file$8, 181, 12, 5131);
    			attr_dev(div0, "class", "mdc-slider__value-indicator");
    			add_location(div0, file$8, 180, 10, 5077);
    			attr_dev(div1, "class", "mdc-slider__value-indicator-container");
    			attr_dev(div1, "aria-hidden", "true");
    			add_location(div1, file$8, 179, 8, 4996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) set_data_dev(t, /*value*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(179:6) {#if discrete}",
    		ctx
    	});

    	return block;
    }

    // (120:6) {#if discrete}
    function create_if_block_2$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t = text(/*start*/ ctx[1]);
    			attr_dev(span, "class", "mdc-slider__value-indicator-text");
    			add_location(span, file$8, 122, 12, 3154);
    			attr_dev(div0, "class", "mdc-slider__value-indicator");
    			add_location(div0, file$8, 121, 10, 3100);
    			attr_dev(div1, "class", "mdc-slider__value-indicator-container");
    			attr_dev(div1, "aria-hidden", "true");
    			add_location(div1, file$8, 120, 8, 3019);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*start*/ 2) set_data_dev(t, /*start*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(120:6) {#if discrete}",
    		ctx
    	});

    	return block;
    }

    // (149:6) {#if discrete}
    function create_if_block_1$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t = text(/*end*/ ctx[2]);
    			attr_dev(span, "class", "mdc-slider__value-indicator-text");
    			add_location(span, file$8, 151, 12, 4141);
    			attr_dev(div0, "class", "mdc-slider__value-indicator");
    			add_location(div0, file$8, 150, 10, 4087);
    			attr_dev(div1, "class", "mdc-slider__value-indicator-container");
    			attr_dev(div1, "aria-hidden", "true");
    			add_location(div1, file$8, 149, 8, 4006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*end*/ 4) set_data_dev(t, /*end*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(149:6) {#if discrete}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div4;
    	let t0;
    	let div3;
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let div1_style_value;
    	let t2;
    	let t3;
    	let div4_class_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*range*/ ctx[6]) return create_if_block_5;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*discrete*/ ctx[7] && /*tickMarks*/ ctx[8] && /*step*/ ctx[9] > 0 && create_if_block_4(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*range*/ ctx[6]) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block2 = current_block_type_1(ctx);

    	let div4_levels = [
    		{
    			class: div4_class_value = Object.entries({
    				[/*className*/ ctx[4]]: true,
    				'mdc-slider': true,
    				'mdc-slider--range': /*range*/ ctx[6],
    				'mdc-slider--discrete': /*discrete*/ ctx[7],
    				'mdc-slider--tick-marks': /*discrete*/ ctx[7] && /*tickMarks*/ ctx[8],
    				'mdc-slider--disabled': /*disabled*/ ctx[5],
    				.../*internalClasses*/ ctx[21]
    			}).filter(func_4).map(func_5).join(' ')
    		},
    		/*range*/ ctx[6]
    		? {
    				'data-min-range': `${/*minRange*/ ctx[12]}`
    			}
    		: {},
    		exclude(/*$$restProps*/ ctx[37], ['input$'])
    	];

    	let div4_data = {};

    	for (let i = 0; i < div4_levels.length; i += 1) {
    		div4_data = assign(div4_data, div4_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			if_block0.c();
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if_block2.c();
    			attr_dev(div0, "class", "mdc-slider__track--inactive");
    			add_location(div0, file$8, 77, 4, 1660);
    			attr_dev(div1, "class", "mdc-slider__track--active_fill");
    			attr_dev(div1, "style", div1_style_value = Object.entries(/*trackActiveStyles*/ ctx[26]).map(func).join(' '));
    			add_location(div1, file$8, 79, 6, 1754);
    			attr_dev(div2, "class", "mdc-slider__track--active");
    			add_location(div2, file$8, 78, 4, 1708);
    			attr_dev(div3, "class", "mdc-slider__track");
    			add_location(div3, file$8, 76, 2, 1624);
    			set_attributes(div4, div4_data);
    			add_location(div4, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			if_block0.m(div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div3, t2);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div4, t3);
    			if_block2.m(div4, null);
    			/*div4_binding*/ ctx[79](div4);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div4, /*use*/ ctx[3])),
    					action_destroyer(/*forwardEvents*/ ctx[32].call(null, div4))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div4, t0);
    				}
    			}

    			if (dirty[0] & /*trackActiveStyles*/ 67108864 && div1_style_value !== (div1_style_value = Object.entries(/*trackActiveStyles*/ ctx[26]).map(func).join(' '))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (/*discrete*/ ctx[7] && /*tickMarks*/ ctx[8] && /*step*/ ctx[9] > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div4, null);
    				}
    			}

    			set_attributes(div4, div4_data = get_spread_update(div4_levels, [
    				dirty[0] & /*className, range, discrete, tickMarks, disabled, internalClasses*/ 2097648 && div4_class_value !== (div4_class_value = Object.entries({
    					[/*className*/ ctx[4]]: true,
    					'mdc-slider': true,
    					'mdc-slider--range': /*range*/ ctx[6],
    					'mdc-slider--discrete': /*discrete*/ ctx[7],
    					'mdc-slider--tick-marks': /*discrete*/ ctx[7] && /*tickMarks*/ ctx[8],
    					'mdc-slider--disabled': /*disabled*/ ctx[5],
    					.../*internalClasses*/ ctx[21]
    				}).filter(func_4).map(func_5).join(' ')) && { class: div4_class_value },
    				dirty[0] & /*range, minRange*/ 4160 && (/*range*/ ctx[6]
    				? {
    						'data-min-range': `${/*minRange*/ ctx[12]}`
    					}
    				: {}),
    				dirty[1] & /*$$restProps*/ 64 && exclude(/*$$restProps*/ ctx[37], ['input$'])
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 8) useActions_action.update.call(null, /*use*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    			/*div4_binding*/ ctx[79](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([name, value]) => `${name}: ${value};`;
    const func_1 = ([name, value]) => `${name}: ${value};`;
    const func_2 = ([name, value]) => `${name}: ${value};`;
    const func_3 = ([name, value]) => `${name}: ${value};`;
    const func_4 = ([name, value]) => name !== '' && value;
    const func_5 = ([name]) => name;

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","disabled","range","discrete","tickMarks","step","min","max","minRange","value","start","end","valueToAriaValueTextFn","hideFocusStylesForPointerEvents","input$class","layout","getId","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	var _a;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { range = false } = $$props;
    	let { discrete = false } = $$props;
    	let { tickMarks = false } = $$props;
    	let { step = 1 } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { minRange = 0 } = $$props;
    	let { value = undefined } = $$props;
    	let { start = undefined } = $$props;
    	let { end = undefined } = $$props;
    	let { valueToAriaValueTextFn = value => `${value}` } = $$props;
    	let { hideFocusStylesForPointerEvents = false } = $$props;
    	let { input$class = '' } = $$props;
    	let element;
    	let instance;
    	let input;
    	let inputStart = undefined;
    	let thumbEl;
    	let thumbStart = undefined;
    	let thumbKnob;
    	let thumbKnobStart = undefined;
    	let internalClasses = {};
    	let thumbStartClasses = {};
    	let thumbClasses = {};
    	let inputAttrs = {};
    	let inputStartAttrs = {};
    	let trackActiveStyles = {};
    	let thumbStyles = {};
    	let thumbStartStyles = {};
    	let thumbRippleActive = false;
    	let thumbStartRippleActive = false;
    	let currentTickMarks;

    	let inputProps = (_a = getContext('SMUI:generic:input:props')) !== null && _a !== void 0
    	? _a
    	: {};

    	let addLayoutListener = getContext('SMUI:addLayoutListener');
    	let removeLayoutListener;
    	let previousMin = min;
    	let previousMax = max;
    	let previousStep = step;
    	let previousDiscrete = discrete;
    	let previousTickMarks = tickMarks;

    	if (tickMarks && step > 0) {
    		const absMax = max + Math.abs(min);

    		if (range && typeof start === 'number' && typeof end === 'number') {
    			const absStart = start + Math.abs(min);
    			const absEnd = end + Math.abs(min);

    			currentTickMarks = [
    				...Array(absStart / step).map(() => TickMark.INACTIVE),
    				...Array(absMax / step - absStart / step - (absMax - absEnd) / step + 1).map(() => TickMark.ACTIVE),
    				...Array((absMax - absEnd) / step).map(() => TickMark.INACTIVE)
    			];
    		} else if (typeof value === 'number') {
    			const absValue = value + Math.abs(min);

    			currentTickMarks = [
    				...Array(absValue / step + 1).map(() => TickMark.ACTIVE),
    				...Array((absMax - absValue) / step).map(() => TickMark.INACTIVE)
    			];
    		}
    	}

    	if (range && typeof start === 'number' && typeof end === 'number') {
    		const percent = (end - start) / (max - min);
    		const percentStart = start / (max - min);
    		const percentEnd = end / (max - min);
    		trackActiveStyles.transform = `scaleX(${percent})`;
    		thumbStyles.left = `calc(${percentEnd * 100}% -24px)`;
    		thumbStartStyles.left = `calc(${percentStart * 100}% -24px)`;
    	} else if (typeof value === 'number') {
    		const percent = value / (max - min);
    		trackActiveStyles.transform = `scaleX(${percent})`;
    		thumbStyles.left = `calc(${percent * 100}% -24px)`;
    	}

    	if (addLayoutListener) {
    		removeLayoutListener = addLayoutListener(layout);
    	}

    	let previousValue = value;
    	let previousStart = start;
    	let previousEnd = end;

    	onMount(() => {
    		$$invalidate(43, instance = new MDCSliderFoundation({
    				hasClass,
    				addClass,
    				removeClass,
    				addThumbClass,
    				removeThumbClass,
    				getAttribute: attribute => getElement().getAttribute(attribute),
    				getInputValue: thumb => {
    					var _a;

    					return `${(_a = range ? thumb === Thumb.START ? start : end : value) !== null && _a !== void 0
					? _a
					: 0}`;
    				},
    				setInputValue: (val, thumb) => {
    					if (range) {
    						if (thumb === Thumb.START) {
    							$$invalidate(1, start = Number(val));
    							$$invalidate(50, previousStart = start);
    						} else {
    							$$invalidate(2, end = Number(val));
    							$$invalidate(51, previousEnd = end);
    						}
    					} else {
    						$$invalidate(0, value = Number(val));
    						$$invalidate(49, previousValue = value);
    					}
    				},
    				getInputAttribute: getInputAttr,
    				setInputAttribute: addInputAttr,
    				removeInputAttribute: removeInputAttr,
    				focusInput: thumb => {
    					if (range && thumb === Thumb.START && inputStart) {
    						inputStart.focus();
    					} else {
    						input.focus();
    					}
    				},
    				isInputFocused: thumb => (range && thumb === Thumb.START ? inputStart : input) === document.activeElement,
    				shouldHideFocusStylesForPointerEvents: () => hideFocusStylesForPointerEvents,
    				getThumbKnobWidth: thumb => {
    					var _a;

    					return ((_a = range && thumb === Thumb.START
    					? thumbKnobStart
    					: thumbKnob) !== null && _a !== void 0
    					? _a
    					: thumbKnob).getBoundingClientRect().width;
    				},
    				getThumbBoundingClientRect: thumb => {
    					var _a;

    					return ((_a = range && thumb === Thumb.START ? thumbStart : thumbEl) !== null && _a !== void 0
    					? _a
    					: thumbEl).getBoundingClientRect();
    				},
    				getBoundingClientRect: () => getElement().getBoundingClientRect(),
    				getValueIndicatorContainerWidth: thumb => {
    					var _a;

    					return ((_a = range && thumb === Thumb.START ? thumbStart : thumbEl) !== null && _a !== void 0
    					? _a
    					: thumbEl).querySelector(`.mdc-slider__value-indicator-container`).getBoundingClientRect().width;
    				},
    				isRTL: () => getComputedStyle(getElement()).direction === 'rtl',
    				setThumbStyleProperty: addThumbStyle,
    				removeThumbStyleProperty: removeThumbStyle,
    				setTrackActiveStyleProperty: addTrackActiveStyle,
    				removeTrackActiveStyleProperty: removeTrackActiveStyle,
    				// Handled by Svelte.
    				setValueIndicatorText: (_value, _thumb) => undefined,
    				getValueToAriaValueTextFn: () => valueToAriaValueTextFn,
    				updateTickMarks: tickMarks => {
    					$$invalidate(31, currentTickMarks = tickMarks);
    				},
    				setPointerCapture: pointerId => {
    					getElement().setPointerCapture(pointerId);
    				},
    				emitChangeEvent: (value, thumb) => {
    					dispatch(getElement(), 'SMUISlider:change', { value, thumb }, undefined, true);
    				},
    				emitInputEvent: (value, thumb) => {
    					dispatch(getElement(), 'SMUISlider:input', { value, thumb }, undefined, true);
    				},
    				emitDragStartEvent: (_, thumb) => {
    					// Emitting event is not yet implemented. See issue:
    					// https://github.com/material-components/material-components-web/issues/6448
    					if (range && thumb === Thumb.START) {
    						$$invalidate(30, thumbStartRippleActive = true);
    					} else {
    						$$invalidate(29, thumbRippleActive = true);
    					}
    				},
    				emitDragEndEvent: (_, thumb) => {
    					// Emitting event is not yet implemented. See issue:
    					// https://github.com/material-components/material-components-web/issues/6448
    					if (range && thumb === Thumb.START) {
    						$$invalidate(30, thumbStartRippleActive = false);
    					} else {
    						$$invalidate(29, thumbRippleActive = false);
    					}
    				},
    				registerEventHandler: (evtType, handler) => {
    					getElement().addEventListener(evtType, handler);
    				},
    				deregisterEventHandler: (evtType, handler) => {
    					getElement().removeEventListener(evtType, handler);
    				},
    				registerThumbEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? thumbStart : thumbEl) === null || _a === void 0
    					? void 0
    					: _a.addEventListener(evtType, handler);
    				},
    				deregisterThumbEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? thumbStart : thumbEl) === null || _a === void 0
    					? void 0
    					: _a.removeEventListener(evtType, handler);
    				},
    				registerInputEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? inputStart : input) === null || _a === void 0
    					? void 0
    					: _a.addEventListener(evtType, handler);
    				},
    				deregisterInputEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? inputStart : input) === null || _a === void 0
    					? void 0
    					: _a.removeEventListener(evtType, handler);
    				},
    				registerBodyEventHandler: (evtType, handler) => {
    					document.body.addEventListener(evtType, handler);
    				},
    				deregisterBodyEventHandler: (evtType, handler) => {
    					document.body.removeEventListener(evtType, handler);
    				},
    				registerWindowEventHandler: (evtType, handler) => {
    					window.addEventListener(evtType, handler);
    				},
    				deregisterWindowEventHandler: (evtType, handler) => {
    					window.removeEventListener(evtType, handler);
    				}
    			}));

    		const accessor = {
    			get element() {
    				return getElement();
    			},
    			activateRipple() {
    				if (!disabled) {
    					$$invalidate(29, thumbRippleActive = true);
    				}
    			},
    			deactivateRipple() {
    				$$invalidate(29, thumbRippleActive = false);
    			}
    		};

    		dispatch(element, 'SMUIGenericInput:mount', accessor);
    		instance.init();
    		instance.layout({ skipUpdateUI: true });

    		return () => {
    			dispatch(element, 'SMUIGenericInput:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	onDestroy(() => {
    		if (removeLayoutListener) {
    			removeLayoutListener();
    		}
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(21, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(21, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addThumbClass(className, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (!thumbStartClasses[className]) {
    				$$invalidate(22, thumbStartClasses[className] = true, thumbStartClasses);
    			}
    		} else {
    			if (!thumbClasses[className]) {
    				$$invalidate(23, thumbClasses[className] = true, thumbClasses);
    			}
    		}
    	}

    	function removeThumbClass(className, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (!(className in thumbStartClasses) || thumbStartClasses[className]) {
    				$$invalidate(22, thumbStartClasses[className] = false, thumbStartClasses);
    			}
    		} else {
    			if (!(className in thumbClasses) || thumbClasses[className]) {
    				$$invalidate(23, thumbClasses[className] = false, thumbClasses);
    			}
    		}
    	}

    	function addThumbStyle(name, value, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (thumbStartStyles[name] != value) {
    				if (value === '' || value == null) {
    					delete thumbStartStyles[name];
    					$$invalidate(28, thumbStartStyles);
    				} else {
    					$$invalidate(28, thumbStartStyles[name] = value, thumbStartStyles);
    				}
    			}
    		} else {
    			if (thumbStyles[name] != value) {
    				if (value === '' || value == null) {
    					delete thumbStyles[name];
    					$$invalidate(27, thumbStyles);
    				} else {
    					$$invalidate(27, thumbStyles[name] = value, thumbStyles);
    				}
    			}
    		}
    	}

    	function removeThumbStyle(name, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (name in thumbStartStyles) {
    				delete thumbStartStyles[name];
    				$$invalidate(28, thumbStartStyles);
    			}
    		} else {
    			if (name in thumbStyles) {
    				delete thumbStyles[name];
    				$$invalidate(27, thumbStyles);
    			}
    		}
    	}

    	function getInputAttr(name, thumb) {
    		var _a, _b, _c;

    		// Some custom logic for "value", since Svelte doesn't seem to actually
    		// set the attribute, just the DOM property.
    		if (range && thumb === Thumb.START) {
    			if (name === 'value') {
    				return `${start}`;
    			}

    			return name in inputStartAttrs
    			? (_a = inputStartAttrs[name]) !== null && _a !== void 0
    				? _a
    				: null
    			: (_b = inputStart === null || inputStart === void 0
    				? void 0
    				: inputStart.getAttribute(name)) !== null && _b !== void 0
    				? _b
    				: null;
    		} else {
    			if (name === 'value') {
    				return `${range ? end : value}`;
    			}

    			return name in inputAttrs
    			? (_c = inputAttrs[name]) !== null && _c !== void 0
    				? _c
    				: null
    			: input.getAttribute(name);
    		}
    	}

    	function addInputAttr(name, value, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (inputStartAttrs[name] !== value) {
    				$$invalidate(25, inputStartAttrs[name] = value, inputStartAttrs);
    			}
    		} else {
    			if (inputAttrs[name] !== value) {
    				$$invalidate(24, inputAttrs[name] = value, inputAttrs);
    			}
    		}
    	}

    	function removeInputAttr(name, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (!(name in inputStartAttrs) || inputStartAttrs[name] != null) {
    				$$invalidate(25, inputStartAttrs[name] = undefined, inputStartAttrs);
    			}
    		} else {
    			if (!(name in inputAttrs) || inputAttrs[name] != null) {
    				$$invalidate(24, inputAttrs[name] = undefined, inputAttrs);
    			}
    		}
    	}

    	function addTrackActiveStyle(name, value) {
    		if (trackActiveStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete trackActiveStyles[name];
    				$$invalidate(26, trackActiveStyles);
    			} else {
    				$$invalidate(26, trackActiveStyles[name] = value, trackActiveStyles);
    			}
    		}
    	}

    	function removeTrackActiveStyle(name) {
    		if (name in trackActiveStyles) {
    			delete trackActiveStyles[name];
    			$$invalidate(26, trackActiveStyles);
    		}
    	}

    	function layout() {
    		return instance.layout();
    	}

    	function getId() {
    		return inputProps && inputProps.id;
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputStart = $$value;
    			$$invalidate(16, inputStart);
    		});
    	}

    	function input0_change_input_handler() {
    		start = to_number(this.value);
    		$$invalidate(1, start);
    	}

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(15, input);
    		});
    	}

    	function input1_change_input_handler() {
    		end = to_number(this.value);
    		$$invalidate(2, end);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(15, input);
    		});
    	}

    	function input_1_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbKnobStart = $$value;
    			$$invalidate(20, thumbKnobStart);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbStart = $$value;
    			$$invalidate(18, thumbStart);
    		});
    	}

    	const Ripple_function = className => addThumbClass(className, Thumb.START);
    	const Ripple_function_1 = className => removeThumbClass(className, Thumb.START);
    	const Ripple_function_2 = (name, value) => addThumbStyle(name, value, Thumb.START);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbKnob = $$value;
    			$$invalidate(19, thumbKnob);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbEl = $$value;
    			$$invalidate(17, thumbEl);
    		});
    	}

    	const Ripple_function_3 = className => addThumbClass(className, Thumb.END);
    	const Ripple_function_4 = className => removeThumbClass(className, Thumb.END);
    	const Ripple_function_5 = (name, value) => addThumbStyle(name, value, Thumb.END);

    	function div0_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbKnob = $$value;
    			$$invalidate(19, thumbKnob);
    		});
    	}

    	function div1_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbEl = $$value;
    			$$invalidate(17, thumbEl);
    		});
    	}

    	const Ripple_function_6 = className => addThumbClass(className, Thumb.END);
    	const Ripple_function_7 = className => removeThumbClass(className, Thumb.END);
    	const Ripple_function_8 = (name, value) => addThumbStyle(name, value, Thumb.END);

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(14, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(37, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(3, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('range' in $$new_props) $$invalidate(6, range = $$new_props.range);
    		if ('discrete' in $$new_props) $$invalidate(7, discrete = $$new_props.discrete);
    		if ('tickMarks' in $$new_props) $$invalidate(8, tickMarks = $$new_props.tickMarks);
    		if ('step' in $$new_props) $$invalidate(9, step = $$new_props.step);
    		if ('min' in $$new_props) $$invalidate(10, min = $$new_props.min);
    		if ('max' in $$new_props) $$invalidate(11, max = $$new_props.max);
    		if ('minRange' in $$new_props) $$invalidate(12, minRange = $$new_props.minRange);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('start' in $$new_props) $$invalidate(1, start = $$new_props.start);
    		if ('end' in $$new_props) $$invalidate(2, end = $$new_props.end);
    		if ('valueToAriaValueTextFn' in $$new_props) $$invalidate(38, valueToAriaValueTextFn = $$new_props.valueToAriaValueTextFn);
    		if ('hideFocusStylesForPointerEvents' in $$new_props) $$invalidate(39, hideFocusStylesForPointerEvents = $$new_props.hideFocusStylesForPointerEvents);
    		if ('input$class' in $$new_props) $$invalidate(13, input$class = $$new_props.input$class);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		MDCSliderFoundation,
    		Thumb,
    		TickMark,
    		onMount,
    		onDestroy,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		forwardEvents,
    		use,
    		className,
    		disabled,
    		range,
    		discrete,
    		tickMarks,
    		step,
    		min,
    		max,
    		minRange,
    		value,
    		start,
    		end,
    		valueToAriaValueTextFn,
    		hideFocusStylesForPointerEvents,
    		input$class,
    		element,
    		instance,
    		input,
    		inputStart,
    		thumbEl,
    		thumbStart,
    		thumbKnob,
    		thumbKnobStart,
    		internalClasses,
    		thumbStartClasses,
    		thumbClasses,
    		inputAttrs,
    		inputStartAttrs,
    		trackActiveStyles,
    		thumbStyles,
    		thumbStartStyles,
    		thumbRippleActive,
    		thumbStartRippleActive,
    		currentTickMarks,
    		inputProps,
    		addLayoutListener,
    		removeLayoutListener,
    		previousMin,
    		previousMax,
    		previousStep,
    		previousDiscrete,
    		previousTickMarks,
    		previousValue,
    		previousStart,
    		previousEnd,
    		hasClass,
    		addClass,
    		removeClass,
    		addThumbClass,
    		removeThumbClass,
    		addThumbStyle,
    		removeThumbStyle,
    		getInputAttr,
    		addInputAttr,
    		removeInputAttr,
    		addTrackActiveStyle,
    		removeTrackActiveStyle,
    		layout,
    		getId,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) _a = $$new_props._a;
    		if ('use' in $$props) $$invalidate(3, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('range' in $$props) $$invalidate(6, range = $$new_props.range);
    		if ('discrete' in $$props) $$invalidate(7, discrete = $$new_props.discrete);
    		if ('tickMarks' in $$props) $$invalidate(8, tickMarks = $$new_props.tickMarks);
    		if ('step' in $$props) $$invalidate(9, step = $$new_props.step);
    		if ('min' in $$props) $$invalidate(10, min = $$new_props.min);
    		if ('max' in $$props) $$invalidate(11, max = $$new_props.max);
    		if ('minRange' in $$props) $$invalidate(12, minRange = $$new_props.minRange);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('start' in $$props) $$invalidate(1, start = $$new_props.start);
    		if ('end' in $$props) $$invalidate(2, end = $$new_props.end);
    		if ('valueToAriaValueTextFn' in $$props) $$invalidate(38, valueToAriaValueTextFn = $$new_props.valueToAriaValueTextFn);
    		if ('hideFocusStylesForPointerEvents' in $$props) $$invalidate(39, hideFocusStylesForPointerEvents = $$new_props.hideFocusStylesForPointerEvents);
    		if ('input$class' in $$props) $$invalidate(13, input$class = $$new_props.input$class);
    		if ('element' in $$props) $$invalidate(14, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(43, instance = $$new_props.instance);
    		if ('input' in $$props) $$invalidate(15, input = $$new_props.input);
    		if ('inputStart' in $$props) $$invalidate(16, inputStart = $$new_props.inputStart);
    		if ('thumbEl' in $$props) $$invalidate(17, thumbEl = $$new_props.thumbEl);
    		if ('thumbStart' in $$props) $$invalidate(18, thumbStart = $$new_props.thumbStart);
    		if ('thumbKnob' in $$props) $$invalidate(19, thumbKnob = $$new_props.thumbKnob);
    		if ('thumbKnobStart' in $$props) $$invalidate(20, thumbKnobStart = $$new_props.thumbKnobStart);
    		if ('internalClasses' in $$props) $$invalidate(21, internalClasses = $$new_props.internalClasses);
    		if ('thumbStartClasses' in $$props) $$invalidate(22, thumbStartClasses = $$new_props.thumbStartClasses);
    		if ('thumbClasses' in $$props) $$invalidate(23, thumbClasses = $$new_props.thumbClasses);
    		if ('inputAttrs' in $$props) $$invalidate(24, inputAttrs = $$new_props.inputAttrs);
    		if ('inputStartAttrs' in $$props) $$invalidate(25, inputStartAttrs = $$new_props.inputStartAttrs);
    		if ('trackActiveStyles' in $$props) $$invalidate(26, trackActiveStyles = $$new_props.trackActiveStyles);
    		if ('thumbStyles' in $$props) $$invalidate(27, thumbStyles = $$new_props.thumbStyles);
    		if ('thumbStartStyles' in $$props) $$invalidate(28, thumbStartStyles = $$new_props.thumbStartStyles);
    		if ('thumbRippleActive' in $$props) $$invalidate(29, thumbRippleActive = $$new_props.thumbRippleActive);
    		if ('thumbStartRippleActive' in $$props) $$invalidate(30, thumbStartRippleActive = $$new_props.thumbStartRippleActive);
    		if ('currentTickMarks' in $$props) $$invalidate(31, currentTickMarks = $$new_props.currentTickMarks);
    		if ('inputProps' in $$props) $$invalidate(33, inputProps = $$new_props.inputProps);
    		if ('addLayoutListener' in $$props) addLayoutListener = $$new_props.addLayoutListener;
    		if ('removeLayoutListener' in $$props) removeLayoutListener = $$new_props.removeLayoutListener;
    		if ('previousMin' in $$props) $$invalidate(44, previousMin = $$new_props.previousMin);
    		if ('previousMax' in $$props) $$invalidate(45, previousMax = $$new_props.previousMax);
    		if ('previousStep' in $$props) $$invalidate(46, previousStep = $$new_props.previousStep);
    		if ('previousDiscrete' in $$props) $$invalidate(47, previousDiscrete = $$new_props.previousDiscrete);
    		if ('previousTickMarks' in $$props) $$invalidate(48, previousTickMarks = $$new_props.previousTickMarks);
    		if ('previousValue' in $$props) $$invalidate(49, previousValue = $$new_props.previousValue);
    		if ('previousStart' in $$props) $$invalidate(50, previousStart = $$new_props.previousStart);
    		if ('previousEnd' in $$props) $$invalidate(51, previousEnd = $$new_props.previousEnd);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*min*/ 1024 | $$self.$$.dirty[1] & /*previousMin, instance*/ 12288) {
    			if (min !== previousMin) {
    				if (instance) {
    					instance.setMin(min);
    				}

    				$$invalidate(44, previousMin = min);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*max*/ 2048 | $$self.$$.dirty[1] & /*previousMax, instance*/ 20480) {
    			if (max !== previousMax) {
    				if (instance) {
    					instance.setMax(max);
    				}

    				$$invalidate(45, previousMax = max);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*step*/ 512 | $$self.$$.dirty[1] & /*previousStep, instance*/ 36864) {
    			if (step !== previousStep) {
    				if (instance) {
    					instance.setStep(step);
    				}

    				$$invalidate(46, previousStep = step);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*discrete*/ 128 | $$self.$$.dirty[1] & /*previousDiscrete, instance*/ 69632) {
    			if (discrete !== previousDiscrete) {
    				if (instance) {
    					instance.setIsDiscrete(discrete);
    				}

    				$$invalidate(47, previousDiscrete = discrete);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tickMarks*/ 256 | $$self.$$.dirty[1] & /*previousTickMarks, instance*/ 135168) {
    			if (tickMarks !== previousTickMarks) {
    				if (instance) {
    					instance.setHasTickMarks(tickMarks);
    				}

    				$$invalidate(48, previousTickMarks = tickMarks);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, start, end*/ 7 | $$self.$$.dirty[1] & /*instance, previousValue, previousStart, previousEnd*/ 1839104) {
    			if (instance) {
    				if (previousValue !== value && typeof value === 'number') {
    					instance.setValue(value);
    				}

    				if (previousStart !== start && typeof start === 'number') {
    					instance.setValueStart(start);
    				}

    				if (previousEnd !== end && typeof end === 'number') {
    					instance.setValue(end);
    				}

    				$$invalidate(49, previousValue = value);
    				$$invalidate(50, previousStart = start);
    				$$invalidate(51, previousEnd = end);

    				// Needed for range start to take effect.
    				instance.layout();
    			}
    		}
    	};

    	return [
    		value,
    		start,
    		end,
    		use,
    		className,
    		disabled,
    		range,
    		discrete,
    		tickMarks,
    		step,
    		min,
    		max,
    		minRange,
    		input$class,
    		element,
    		input,
    		inputStart,
    		thumbEl,
    		thumbStart,
    		thumbKnob,
    		thumbKnobStart,
    		internalClasses,
    		thumbStartClasses,
    		thumbClasses,
    		inputAttrs,
    		inputStartAttrs,
    		trackActiveStyles,
    		thumbStyles,
    		thumbStartStyles,
    		thumbRippleActive,
    		thumbStartRippleActive,
    		currentTickMarks,
    		forwardEvents,
    		inputProps,
    		addThumbClass,
    		removeThumbClass,
    		addThumbStyle,
    		$$restProps,
    		valueToAriaValueTextFn,
    		hideFocusStylesForPointerEvents,
    		layout,
    		getId,
    		getElement,
    		instance,
    		previousMin,
    		previousMax,
    		previousStep,
    		previousDiscrete,
    		previousTickMarks,
    		previousValue,
    		previousStart,
    		previousEnd,
    		blur_handler_1,
    		focus_handler_1,
    		blur_handler,
    		focus_handler,
    		blur_handler_2,
    		focus_handler_2,
    		input0_binding,
    		input0_change_input_handler,
    		input1_binding,
    		input1_change_input_handler,
    		input_1_binding,
    		input_1_change_input_handler,
    		div0_binding,
    		div1_binding,
    		Ripple_function,
    		Ripple_function_1,
    		Ripple_function_2,
    		div2_binding,
    		div3_binding,
    		Ripple_function_3,
    		Ripple_function_4,
    		Ripple_function_5,
    		div0_binding_1,
    		div1_binding_1,
    		Ripple_function_6,
    		Ripple_function_7,
    		Ripple_function_8,
    		div4_binding
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				use: 3,
    				class: 4,
    				disabled: 5,
    				range: 6,
    				discrete: 7,
    				tickMarks: 8,
    				step: 9,
    				min: 10,
    				max: 11,
    				minRange: 12,
    				value: 0,
    				start: 1,
    				end: 2,
    				valueToAriaValueTextFn: 38,
    				hideFocusStylesForPointerEvents: 39,
    				input$class: 13,
    				layout: 40,
    				getId: 41,
    				getElement: 42
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get use() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get range() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set range(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get discrete() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set discrete(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickMarks() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickMarks(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minRange() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minRange(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueToAriaValueTextFn() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueToAriaValueTextFn(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideFocusStylesForPointerEvents() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideFocusStylesForPointerEvents(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$class() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$class(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layout() {
    		return this.$$.ctx[40];
    	}

    	set layout(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getId() {
    		return this.$$.ctx[41];
    	}

    	set getId(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[42];
    	}

    	set getElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MyXlBulb/MyXlBulb.svelte generated by Svelte v3.55.1 */
    const file$7 = "src/components/MyXlBulb/MyXlBulb.svelte";

    // (40:12) <Text weight={500} size='xl' position='right'>
    function create_default_slot_12$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Licht");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(40:12) <Text weight={500} size='xl' position='right'>",
    		ctx
    	});

    	return block;
    }

    // (41:12) <ActionIcon size={20} variant="light" >
    function create_default_slot_11$1(ctx) {
    	let hamburgermenu;
    	let current;
    	hamburgermenu = new HamburgerMenu$1({ props: { size: 20 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(hamburgermenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hamburgermenu, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburgermenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburgermenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hamburgermenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(41:12) <ActionIcon size={20} variant=\\\"light\\\" >",
    		ctx
    	});

    	return block;
    }

    // (39:8) <Group position='apart'>
    function create_default_slot_10$1(ctx) {
    	let text_1;
    	let t;
    	let actionicon;
    	let current;

    	text_1 = new Text$1({
    			props: {
    				weight: 500,
    				size: "xl",
    				position: "right",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon = new ActionIcon$1({
    			props: {
    				size: 20,
    				variant: "light",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    			t = space();
    			create_component(actionicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(actionicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const actionicon_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionicon_changes.$$scope = { dirty, ctx };
    			}

    			actionicon.$set(actionicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			transition_in(actionicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			transition_out(actionicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(actionicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(39:8) <Group position='apart'>",
    		ctx
    	});

    	return block;
    }

    // (45:12) <Text size='sm'>
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("On");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(45:12) <Text size='sm'>",
    		ctx
    	});

    	return block;
    }

    // (43:8) <Group position='center' direction="column">
    function create_default_slot_8$1(ctx) {
    	let lightbulb;
    	let t;
    	let text_1;
    	let current;

    	lightbulb = new LightBulb({
    			props: {
    				size: "130",
    				color: /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status == true
    				? theme$1.colors['yellow500'].value
    				: "white"
    			},
    			$$inline: true
    		});

    	text_1 = new Text$1({
    			props: {
    				size: "sm",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(lightbulb.$$.fragment);
    			t = space();
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lightbulb, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lightbulb_changes = {};

    			if (dirty & /*lights, lightSelector*/ 3) lightbulb_changes.color = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status == true
    			? theme$1.colors['yellow500'].value
    			: "white";

    			lightbulb.$set(lightbulb_changes);
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightbulb.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightbulb.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lightbulb, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(43:8) <Group position='center' direction=\\\"column\\\">",
    		ctx
    	});

    	return block;
    }

    // (52:8) {:else}
    function create_else_block(ctx) {
    	let group;
    	let current;

    	group = new Group$1({
    			props: {
    				spacing: "md",
    				position: "center",
    				style: "height:60px",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(group.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(group, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const group_changes = {};

    			if (dirty & /*$$scope, lights, lightSelector*/ 259) {
    				group_changes.$$scope = { dirty, ctx };
    			}

    			group.$set(group_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(group.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(group.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(group, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(52:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#if lights[lightSelector].type == "onoff"}
    function create_if_block$1(ctx) {
    	let group;
    	let current;

    	group = new Group$1({
    			props: {
    				spacing: "md",
    				position: "center",
    				style: "height:60px",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(group.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(group, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const group_changes = {};

    			if (dirty & /*$$scope, lights, lightSelector*/ 259) {
    				group_changes.$$scope = { dirty, ctx };
    			}

    			group.$set(group_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(group.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(group.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(group, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(48:8) {#if lights[lightSelector].type == \\\"onoff\\\"}",
    		ctx
    	});

    	return block;
    }

    // (53:12) <Group spacing="md" position='center' style="height:60px">
    function create_default_slot_7$1(ctx) {
    	let switch_1;
    	let updating_checked;
    	let t;
    	let slider;
    	let updating_value;
    	let current;

    	function switch_1_checked_binding_1(value) {
    		/*switch_1_checked_binding_1*/ ctx[6](value);
    	}

    	let switch_1_props = { size: "md", radius: "lg" };

    	if (/*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status !== void 0) {
    		switch_1_props.checked = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status;
    	}

    	switch_1 = new Switch$1({ props: switch_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(switch_1, 'checked', switch_1_checked_binding_1));

    	function slider_value_binding(value) {
    		/*slider_value_binding*/ ctx[7](value);
    	}

    	let slider_props = {};

    	if (/*lights*/ ctx[0][/*lightSelector*/ ctx[1]].level !== void 0) {
    		slider_props.value = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].level;
    	}

    	slider = new Slider({ props: slider_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider, 'value', slider_value_binding));

    	const block = {
    		c: function create() {
    			create_component(switch_1.$$.fragment);
    			t = space();
    			create_component(slider.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(switch_1, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(slider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_1_changes = {};

    			if (!updating_checked && dirty & /*lights, lightSelector*/ 3) {
    				updating_checked = true;
    				switch_1_changes.checked = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status;
    				add_flush_callback(() => updating_checked = false);
    			}

    			switch_1.$set(switch_1_changes);
    			const slider_changes = {};

    			if (!updating_value && dirty & /*lights, lightSelector*/ 3) {
    				updating_value = true;
    				slider_changes.value = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].level;
    				add_flush_callback(() => updating_value = false);
    			}

    			slider.$set(slider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(switch_1.$$.fragment, local);
    			transition_in(slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(switch_1.$$.fragment, local);
    			transition_out(slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(switch_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(slider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(53:12) <Group spacing=\\\"md\\\" position='center' style=\\\"height:60px\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:12) <Group spacing="md" position='center' style="height:60px">
    function create_default_slot_6$1(ctx) {
    	let switch_1;
    	let updating_checked;
    	let current;

    	function switch_1_checked_binding(value) {
    		/*switch_1_checked_binding*/ ctx[5](value);
    	}

    	let switch_1_props = { size: "md", radius: "lg" };

    	if (/*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status !== void 0) {
    		switch_1_props.checked = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status;
    	}

    	switch_1 = new Switch$1({ props: switch_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(switch_1, 'checked', switch_1_checked_binding));

    	const block = {
    		c: function create() {
    			create_component(switch_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(switch_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_1_changes = {};

    			if (!updating_checked && dirty & /*lights, lightSelector*/ 3) {
    				updating_checked = true;
    				switch_1_changes.checked = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].status;
    				add_flush_callback(() => updating_checked = false);
    			}

    			switch_1.$set(switch_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(switch_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(switch_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(switch_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(49:12) <Group spacing=\\\"md\\\" position='center' style=\\\"height:60px\\\">",
    		ctx
    	});

    	return block;
    }

    // (60:12) <ActionIcon variant="light" on:click={lightSelectorBw}>
    function create_default_slot_5$1(ctx) {
    	let caretleft;
    	let current;
    	caretleft = new CaretLeft$1({ props: { size: 20 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(caretleft.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caretleft, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caretleft.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caretleft.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caretleft, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(60:12) <ActionIcon variant=\\\"light\\\" on:click={lightSelectorBw}>",
    		ctx
    	});

    	return block;
    }

    // (64:16) <Text align='center'>
    function create_default_slot_4$1(ctx) {
    	let t_value = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lights, lightSelector*/ 3 && t_value !== (t_value = /*lights*/ ctx[0][/*lightSelector*/ ctx[1]].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(64:16) <Text align='center'>",
    		ctx
    	});

    	return block;
    }

    // (66:12) <ActionIcon  variant="light" on:click={lightSelectorFw}>
    function create_default_slot_3$2(ctx) {
    	let caretright;
    	let current;
    	caretright = new CaretRight$1({ props: { size: 20 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(caretright.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caretright, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caretright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caretright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caretright, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(66:12) <ActionIcon  variant=\\\"light\\\" on:click={lightSelectorFw}>",
    		ctx
    	});

    	return block;
    }

    // (59:8) <Group position="center" spacing="xl" >
    function create_default_slot_2$2(ctx) {
    	let actionicon0;
    	let t0;
    	let div;
    	let text_1;
    	let t1;
    	let actionicon1;
    	let current;

    	actionicon0 = new ActionIcon$1({
    			props: {
    				variant: "light",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon0.$on("click", /*lightSelectorBw*/ ctx[4]);

    	text_1 = new Text$1({
    			props: {
    				align: "center",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon1 = new ActionIcon$1({
    			props: {
    				variant: "light",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon1.$on("click", /*lightSelectorFw*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(actionicon0.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(text_1.$$.fragment);
    			t1 = space();
    			create_component(actionicon1.$$.fragment);
    			set_style(div, "width", "100px");
    			add_location(div, file$7, 62, 12, 2675);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionicon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(text_1, div, null);
    			insert_dev(target, t1, anchor);
    			mount_component(actionicon1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionicon0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionicon0_changes.$$scope = { dirty, ctx };
    			}

    			actionicon0.$set(actionicon0_changes);
    			const text_1_changes = {};

    			if (dirty & /*$$scope, lights, lightSelector*/ 259) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const actionicon1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionicon1_changes.$$scope = { dirty, ctx };
    			}

    			actionicon1.$set(actionicon1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionicon0.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			transition_in(actionicon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionicon0.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			transition_out(actionicon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionicon0, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(text_1);
    			if (detaching) detach_dev(t1);
    			destroy_component(actionicon1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(59:8) <Group position=\\\"center\\\" spacing=\\\"xl\\\" >",
    		ctx
    	});

    	return block;
    }

    // (38:4) <Stack>
    function create_default_slot_1$2(ctx) {
    	let group0;
    	let t0;
    	let group1;
    	let t1;
    	let space0;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let t3;
    	let space1;
    	let t4;
    	let group2;
    	let current;

    	group0 = new Group$1({
    			props: {
    				position: "apart",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	group1 = new Group$1({
    			props: {
    				position: "center",
    				direction: "column",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	space0 = new Space$1({ props: { h: 5 }, $$inline: true });
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*lights*/ ctx[0][/*lightSelector*/ ctx[1]].type == "onoff") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	space1 = new Space$1({ props: { h: 5 }, $$inline: true });

    	group2 = new Group$1({
    			props: {
    				position: "center",
    				spacing: "xl",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(group0.$$.fragment);
    			t0 = space();
    			create_component(group1.$$.fragment);
    			t1 = space();
    			create_component(space0.$$.fragment);
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			create_component(space1.$$.fragment);
    			t4 = space();
    			create_component(group2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(group0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(group1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(space0, target, anchor);
    			insert_dev(target, t2, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(space1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(group2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const group0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				group0_changes.$$scope = { dirty, ctx };
    			}

    			group0.$set(group0_changes);
    			const group1_changes = {};

    			if (dirty & /*$$scope, lights, lightSelector*/ 259) {
    				group1_changes.$$scope = { dirty, ctx };
    			}

    			group1.$set(group1_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(t3.parentNode, t3);
    			}

    			const group2_changes = {};

    			if (dirty & /*$$scope, lights, lightSelector*/ 259) {
    				group2_changes.$$scope = { dirty, ctx };
    			}

    			group2.$set(group2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(group0.$$.fragment, local);
    			transition_in(group1.$$.fragment, local);
    			transition_in(space0.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(space1.$$.fragment, local);
    			transition_in(group2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(group0.$$.fragment, local);
    			transition_out(group1.$$.fragment, local);
    			transition_out(space0.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(space1.$$.fragment, local);
    			transition_out(group2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(group0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(group1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(space0, detaching);
    			if (detaching) detach_dev(t2);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(space1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(group2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(38:4) <Stack>",
    		ctx
    	});

    	return block;
    }

    // (37:0) <Paper radius="md" withBorder override={MyXlCardShadow} >
    function create_default_slot$2(ctx) {
    	let stack;
    	let current;

    	stack = new Stack$1({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, lights, lightSelector*/ 259) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(37:0) <Paper radius=\\\"md\\\" withBorder override={MyXlCardShadow} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let paper;
    	let current;

    	paper = new Paper$1({
    			props: {
    				radius: "md",
    				withBorder: true,
    				override: /*MyXlCardShadow*/ ctx[2],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(paper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paper_changes = {};

    			if (dirty & /*$$scope, lights, lightSelector*/ 259) {
    				paper_changes.$$scope = { dirty, ctx };
    			}

    			paper.$set(paper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyXlBulb', slots, []);

    	const MyXlCardShadow = {
    		'$$gray': theme$1.colors['gray200'].value,
    		boxShadow: '0 1px 2px $$gray',
    		transition: 'all 0.2s ease-in-out',
    		'&:hover': { boxShadow: '0 1px 3px $$gray' }
    	};

    	let lights = [
    		{
    			name: "Wohnen HUE",
    			type: "dim",
    			status: true,
    			level: 50
    		},
    		{
    			name: "Bad HUE",
    			type: "dim",
    			status: false,
    			level: 40
    		},
    		{
    			name: "Kind HUE",
    			type: "dim",
    			status: true,
    			level: 80
    		},
    		{
    			name: "Terasse HUE",
    			type: "dim",
    			status: true,
    			level: 10
    		},
    		{
    			name: "Wohnen",
    			type: "onoff",
    			status: false,
    			level: 0
    		},
    		{
    			name: "Flur",
    			type: "onoff",
    			status: true,
    			level: 0
    		},
    		{
    			name: "Treppe",
    			type: "onoff",
    			status: true,
    			level: 0
    		}
    	];

    	let lightSelector = 0;

    	function lightSelectorFw() {
    		if (lightSelector == lights.length - 1) {
    			$$invalidate(1, lightSelector = 0);
    		} else {
    			$$invalidate(1, lightSelector += 1);
    		}
    	}

    	function lightSelectorBw() {
    		if (lightSelector == 0) {
    			$$invalidate(1, lightSelector = lights.length - 1);
    		} else {
    			$$invalidate(1, lightSelector -= 1);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyXlBulb> was created with unknown prop '${key}'`);
    	});

    	function switch_1_checked_binding(value) {
    		if ($$self.$$.not_equal(lights[lightSelector].status, value)) {
    			lights[lightSelector].status = value;
    			$$invalidate(0, lights);
    		}
    	}

    	function switch_1_checked_binding_1(value) {
    		if ($$self.$$.not_equal(lights[lightSelector].status, value)) {
    			lights[lightSelector].status = value;
    			$$invalidate(0, lights);
    		}
    	}

    	function slider_value_binding(value) {
    		if ($$self.$$.not_equal(lights[lightSelector].level, value)) {
    			lights[lightSelector].level = value;
    			$$invalidate(0, lights);
    		}
    	}

    	$$self.$capture_state = () => ({
    		Stack: Stack$1,
    		Paper: Paper$1,
    		Group: Group$1,
    		Text: Text$1,
    		Switch: Switch$1,
    		Space: Space$1,
    		ActionIcon: ActionIcon$1,
    		theme: theme$1,
    		LightBulb,
    		CaretLeft: CaretLeft$1,
    		CaretRight: CaretRight$1,
    		HamburgerMenu: HamburgerMenu$1,
    		Slider,
    		onMount,
    		MyXlCardShadow,
    		lights,
    		lightSelector,
    		lightSelectorFw,
    		lightSelectorBw
    	});

    	$$self.$inject_state = $$props => {
    		if ('lights' in $$props) $$invalidate(0, lights = $$props.lights);
    		if ('lightSelector' in $$props) $$invalidate(1, lightSelector = $$props.lightSelector);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		lights,
    		lightSelector,
    		MyXlCardShadow,
    		lightSelectorFw,
    		lightSelectorBw,
    		switch_1_checked_binding,
    		switch_1_checked_binding_1,
    		slider_value_binding
    	];
    }

    class MyXlBulb extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyXlBulb",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* node_modules/svelte-carousel/src/components/Dot/Dot.svelte generated by Svelte v3.55.1 */

    const file$6 = "node_modules/svelte-carousel/src/components/Dot/Dot.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "sc-carousel-button sc-carousel-dot__dot svelte-yu7247");
    			toggle_class(button, "sc-carousel-dot__dot_active", /*active*/ ctx[0]);
    			add_location(button, file$6, 7, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*active*/ 1) {
    				toggle_class(button, "sc-carousel-dot__dot_active", /*active*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dot', slots, []);
    	let { active = false } = $$props;
    	const writable_props = ['active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dot> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({ active });

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active, click_handler];
    }

    class Dot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { active: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dot",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get active() {
    		throw new Error("<Dot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Dot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-carousel/src/components/Dots/Dots.svelte generated by Svelte v3.55.1 */
    const file$5 = "node_modules/svelte-carousel/src/components/Dots/Dots.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (23:2) {#each Array(pagesCount) as _, pageIndex (pageIndex)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let dot;
    	let t;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*pageIndex*/ ctx[7]);
    	}

    	dot = new Dot({
    			props: {
    				active: /*currentPageIndex*/ ctx[1] === /*pageIndex*/ ctx[7]
    			},
    			$$inline: true
    		});

    	dot.$on("click", click_handler);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(dot.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "sc-carousel-dots__dot-container svelte-1oj5bge");
    			add_location(div, file$5, 23, 4, 515);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(dot, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const dot_changes = {};
    			if (dirty & /*currentPageIndex, pagesCount*/ 3) dot_changes.active = /*currentPageIndex*/ ctx[1] === /*pageIndex*/ ctx[7];
    			dot.$set(dot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(dot);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:2) {#each Array(pagesCount) as _, pageIndex (pageIndex)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = Array(/*pagesCount*/ ctx[0]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*pageIndex*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "sc-carousel-dots__container svelte-1oj5bge");
    			add_location(div, file$5, 21, 0, 411);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentPageIndex, Array, pagesCount, handleDotClick*/ 7) {
    				each_value = Array(/*pagesCount*/ ctx[0]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dots', slots, []);
    	const dispatch = createEventDispatcher();
    	let { pagesCount = 1 } = $$props;
    	let { currentPageIndex = 0 } = $$props;

    	function handleDotClick(pageIndex) {
    		dispatch('pageChange', pageIndex);
    	}

    	const writable_props = ['pagesCount', 'currentPageIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dots> was created with unknown prop '${key}'`);
    	});

    	const click_handler = pageIndex => handleDotClick(pageIndex);

    	$$self.$$set = $$props => {
    		if ('pagesCount' in $$props) $$invalidate(0, pagesCount = $$props.pagesCount);
    		if ('currentPageIndex' in $$props) $$invalidate(1, currentPageIndex = $$props.currentPageIndex);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Dot,
    		dispatch,
    		pagesCount,
    		currentPageIndex,
    		handleDotClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('pagesCount' in $$props) $$invalidate(0, pagesCount = $$props.pagesCount);
    		if ('currentPageIndex' in $$props) $$invalidate(1, currentPageIndex = $$props.currentPageIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pagesCount, currentPageIndex, handleDotClick, click_handler];
    }

    class Dots extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { pagesCount: 0, currentPageIndex: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dots",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get pagesCount() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pagesCount(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPageIndex() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPageIndex(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const PREV = 'prev';
    const NEXT = 'next';

    /* node_modules/svelte-carousel/src/components/Arrow/Arrow.svelte generated by Svelte v3.55.1 */
    const file$4 = "node_modules/svelte-carousel/src/components/Arrow/Arrow.svelte";

    function create_fragment$4(ctx) {
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "sc-carousel-arrow__arrow svelte-9ztt4p");
    			toggle_class(i, "sc-carousel-arrow__arrow-next", /*direction*/ ctx[0] === NEXT);
    			toggle_class(i, "sc-carousel-arrow__arrow-prev", /*direction*/ ctx[0] === PREV);
    			add_location(i, file$4, 19, 2, 393);
    			attr_dev(button, "class", "sc-carousel-button sc-carousel-arrow__circle svelte-9ztt4p");
    			toggle_class(button, "sc-carousel-arrow__circle_disabled", /*disabled*/ ctx[1]);
    			add_location(button, file$4, 14, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*direction, NEXT*/ 1) {
    				toggle_class(i, "sc-carousel-arrow__arrow-next", /*direction*/ ctx[0] === NEXT);
    			}

    			if (dirty & /*direction, PREV*/ 1) {
    				toggle_class(i, "sc-carousel-arrow__arrow-prev", /*direction*/ ctx[0] === PREV);
    			}

    			if (dirty & /*disabled*/ 2) {
    				toggle_class(button, "sc-carousel-arrow__circle_disabled", /*disabled*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow', slots, []);
    	let { direction = NEXT } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ['direction', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    	};

    	$$self.$capture_state = () => ({ NEXT, PREV, direction, disabled });

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [direction, disabled, click_handler];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { direction: 0, disabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get direction() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-carousel/src/components/Progress/Progress.svelte generated by Svelte v3.55.1 */

    const file$3 = "node_modules/svelte-carousel/src/components/Progress/Progress.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "sc-carousel-progress__indicator svelte-nuyenl");
    			set_style(div, "width", /*width*/ ctx[0] + "%");
    			add_location(div, file$3, 11, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const MAX_PERCENT = 100;

    function instance$3($$self, $$props, $$invalidate) {
    	let width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Progress', slots, []);
    	let { value = 0 } = $$props;
    	const writable_props = ['value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Progress> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ MAX_PERCENT, value, width });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 2) {
    			$$invalidate(0, width = Math.min(Math.max(value * MAX_PERCENT, 0), MAX_PERCENT));
    		}
    	};

    	return [width, value];
    }

    class Progress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { value: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Progress",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get value() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // start event
    function addStartEventListener(source, cb) {
      source.addEventListener('mousedown', cb);
      source.addEventListener('touchstart', cb, { passive: true });
    }
    function removeStartEventListener(source, cb) {
      source.removeEventListener('mousedown', cb);
      source.removeEventListener('touchstart', cb);
    }

    // end event
    function addEndEventListener(source, cb) {
      source.addEventListener('mouseup', cb);
      source.addEventListener('touchend', cb);
    }
    function removeEndEventListener(source, cb) {
      source.removeEventListener('mouseup', cb);
      source.removeEventListener('touchend', cb);
    }

    // move event
    function addMoveEventListener(source, cb) {
      source.addEventListener('mousemove', cb);
      source.addEventListener('touchmove', cb);
    }
    function removeMoveEventListener(source, cb) {
      source.removeEventListener('mousemove', cb);
      source.removeEventListener('touchmove', cb);
    }

    function createDispatcher(source) {
      return function (event, data) {
        source.dispatchEvent(
          new CustomEvent(event, {
            detail: data,
          })
        );
      }
    }

    const TAP_DURATION_MS = 110;
    const TAP_MOVEMENT_PX = 9; // max movement during the tap, keep it small

    const SWIPE_MIN_DURATION_MS = 111;
    const SWIPE_MIN_DISTANCE_PX = 20;

    function getCoords(event) {
      if ('TouchEvent' in window && event instanceof TouchEvent) {
        const touch = event.touches[0];
        return {
          x: touch ? touch.clientX : 0,
          y: touch ? touch.clientY : 0,
        }
      }
      return {
        x: event.clientX,
        y: event.clientY,
      }
    }

    function swipeable(node, { thresholdProvider }) {
      const dispatch = createDispatcher(node);
      let x;
      let y;
      let moved = 0;
      let swipeStartedAt;
      let isTouching = false;

      function isValidSwipe() {
        const swipeDurationMs = Date.now() - swipeStartedAt;
        return swipeDurationMs >= SWIPE_MIN_DURATION_MS && Math.abs(moved) >= SWIPE_MIN_DISTANCE_PX
      }

      function handleDown(event) {
        swipeStartedAt = Date.now();
        moved = 0;
        isTouching = true;
        const coords = getCoords(event);
        x = coords.x;
        y = coords.y;
        dispatch('swipeStart', { x, y });
        addMoveEventListener(window, handleMove);
        addEndEventListener(window, handleUp);
      }

      function handleMove(event) {
        if (!isTouching) return
        const coords = getCoords(event);
        const dx = coords.x - x;
        const dy = coords.y - y;
        x = coords.x;
        y = coords.y;
        dispatch('swipeMove', { x, y, dx, dy });

        if (dx !== 0 && Math.sign(dx) !== Math.sign(moved)) {
          moved = 0;
        }
        moved += dx;
        if (Math.abs(moved) > thresholdProvider()) {
          dispatch('swipeThresholdReached', { direction: moved > 0 ? PREV : NEXT });
          removeEndEventListener(window, handleUp);
          removeMoveEventListener(window, handleMove);
        }
      }

      function handleUp(event) {
        removeEndEventListener(window, handleUp);
        removeMoveEventListener(window, handleMove);

        isTouching = false;

        if (!isValidSwipe()) {
          dispatch('swipeFailed');
          return
        }
        const coords = getCoords(event);
        dispatch('swipeEnd', { x: coords.x, y: coords.y });
      }

      addStartEventListener(node, handleDown);
      return {
        destroy() {
          removeStartEventListener(node, handleDown);
        },
      }
    }

    // in event
    function addHoverInEventListener(source, cb) {
      source.addEventListener('mouseenter', cb);
    }
    function removeHoverInEventListener(source, cb) {
      source.removeEventListener('mouseenter', cb);
    }

    // out event
    function addHoverOutEventListener(source, cb) {
      source.addEventListener('mouseleave', cb);
    }
    function removeHoverOutEventListener(source, cb) {
      source.removeEventListener('mouseleave', cb);
    }

    /**
     * hoverable events are for mouse events only
     */
    function hoverable(node) {
      const dispatch = createDispatcher(node);

      function handleHoverIn() {
        addHoverOutEventListener(node, handleHoverOut);
        dispatch('hovered', { value: true });
      }

      function handleHoverOut() {
        dispatch('hovered', { value: false });
        removeHoverOutEventListener(node, handleHoverOut);
      }

      addHoverInEventListener(node, handleHoverIn);
      
      return {
        destroy() {
          removeHoverInEventListener(node, handleHoverIn);
          removeHoverOutEventListener(node, handleHoverOut);
        },
      }
    }

    const getDistance = (p1, p2) => {
      const xDist = p2.x - p1.x;
      const yDist = p2.y - p1.y;

      return Math.sqrt((xDist * xDist) + (yDist * yDist));
    };

    function getValueInRange(min, value, max) {
      return Math.max(min, Math.min(value, max))
    }

    // tap start event
    function addFocusinEventListener(source, cb) {
      source.addEventListener('touchstart', cb, { passive: true });
    }
    function removeFocusinEventListener(source, cb) {
      source.removeEventListener('touchstart', cb);
    }

    // tap end event
    function addFocusoutEventListener(source, cb) {
      source.addEventListener('touchend', cb);
    }
    function removeFocusoutEventListener(source, cb) {
      source.removeEventListener('touchend', cb);
    }

    /**
     * tappable events are for touchable devices only
     */
    function tappable(node) {
      const dispatch = createDispatcher(node);

      let tapStartedAt = 0;
      let tapStartPos = { x: 0, y: 0 };

      function getIsValidTap({
        tapEndedAt,
        tapEndedPos
      }) {
        const tapTime = tapEndedAt - tapStartedAt;
        const tapDist = getDistance(tapStartPos, tapEndedPos);
        return (
          tapTime <= TAP_DURATION_MS &&
          tapDist <= TAP_MOVEMENT_PX
        )
      }

      function handleTapstart(event) {
        tapStartedAt = Date.now();

        const touch = event.touches[0];
        tapStartPos = { x: touch.clientX, y: touch.clientY };

        addFocusoutEventListener(node, handleTapend);
      }

      function handleTapend(event) {
        removeFocusoutEventListener(node, handleTapend);

        const touch = event.changedTouches[0];
        if (getIsValidTap({
          tapEndedAt: Date.now(),
          tapEndedPos: { x: touch.clientX, y: touch.clientY }
        })) {
          dispatch('tapped');
        }
      }

      addFocusinEventListener(node, handleTapstart);
      
      return {
        destroy() {
          removeFocusinEventListener(node, handleTapstart);
          removeFocusoutEventListener(node, handleTapend);
        },
      }
    }

    // getCurrentPageIndexByCurrentParticleIndex

    function _getCurrentPageIndexByCurrentParticleIndexInfinite({
      currentParticleIndex,
      particlesCount,
      clonesCountHead,
      clonesCountTotal,
      particlesToScroll,
    }) {
      if (currentParticleIndex === particlesCount - clonesCountHead) return 0
      if (currentParticleIndex === 0) return _getPagesCountByParticlesCountInfinite({
        particlesCountWithoutClones: particlesCount - clonesCountTotal,
        particlesToScroll,
      }) - 1
      return Math.floor((currentParticleIndex - clonesCountHead) / particlesToScroll)
    }

    function _getCurrentPageIndexByCurrentParticleIndexLimited({
      currentParticleIndex,
      particlesToScroll,
    }) {
      return Math.ceil(currentParticleIndex / particlesToScroll)
    }

    function getCurrentPageIndexByCurrentParticleIndex({
      currentParticleIndex,
      particlesCount,
      clonesCountHead,
      clonesCountTotal,
      infinite,
      particlesToScroll,
    }) {
      return infinite
        ? _getCurrentPageIndexByCurrentParticleIndexInfinite({
          currentParticleIndex,
          particlesCount,
          clonesCountHead,
          clonesCountTotal,
          particlesToScroll,
        })
        : _getCurrentPageIndexByCurrentParticleIndexLimited({
          currentParticleIndex,
          particlesToScroll,
        })
    }

    // getPagesCountByParticlesCount

    function _getPagesCountByParticlesCountInfinite({
      particlesCountWithoutClones,
      particlesToScroll,
    }) {
      return Math.ceil(particlesCountWithoutClones / particlesToScroll)
    }

    function _getPagesCountByParticlesCountLimited({
      particlesCountWithoutClones,
      particlesToScroll,
      particlesToShow,
    }) {
      const partialPageSize = getPartialPageSize({
        particlesCountWithoutClones,
        particlesToScroll,
        particlesToShow,
      });
      return Math.ceil(particlesCountWithoutClones / particlesToScroll) - partialPageSize
    }

    function getPagesCountByParticlesCount({
      infinite,
      particlesCountWithoutClones,
      particlesToScroll,
      particlesToShow,
    }) {
      return infinite
        ? _getPagesCountByParticlesCountInfinite({
          particlesCountWithoutClones,
          particlesToScroll,
        })
        : _getPagesCountByParticlesCountLimited({
          particlesCountWithoutClones,
          particlesToScroll,
          particlesToShow,
        })
    }

    // getParticleIndexByPageIndex

    function _getParticleIndexByPageIndexInfinite({
      pageIndex,
      clonesCountHead,
      clonesCountTail,
      particlesToScroll,
      particlesCount,
    }) {
      return getValueInRange(
        0,
        Math.min(clonesCountHead + pageIndex * particlesToScroll, particlesCount - clonesCountTail),
        particlesCount - 1
      )
    }

    function _getParticleIndexByPageIndexLimited({
      pageIndex,
      particlesToScroll,
      particlesCount,
      particlesToShow,
    }) {
      return getValueInRange(
        0,
        Math.min(pageIndex * particlesToScroll, particlesCount - particlesToShow),
        particlesCount - 1
      ) 
    }

    function getParticleIndexByPageIndex({
      infinite,
      pageIndex,
      clonesCountHead,
      clonesCountTail,
      particlesToScroll,
      particlesCount,
      particlesToShow,
    }) {
      return infinite
        ? _getParticleIndexByPageIndexInfinite({
          pageIndex,
          clonesCountHead,
          clonesCountTail,
          particlesToScroll,
          particlesCount,
        })
        : _getParticleIndexByPageIndexLimited({
          pageIndex,
          particlesToScroll,
          particlesCount,
          particlesToShow,
        })
    }

    function applyParticleSizes({
      particlesContainerChildren,
      particleWidth,
    }) {
      for (let particleIndex=0; particleIndex<particlesContainerChildren.length; particleIndex++) {
        particlesContainerChildren[particleIndex].style.minWidth = `${particleWidth}px`;
        particlesContainerChildren[particleIndex].style.maxWidth = `${particleWidth}px`;
      }
    }

    function getPartialPageSize({
      particlesToScroll,
      particlesToShow,
      particlesCountWithoutClones, 
    }) {
      const overlap = particlesToScroll - particlesToShow;
      let particlesCount = particlesToShow;

      while(true) {
        const diff = particlesCountWithoutClones - particlesCount - overlap;
        if (diff < particlesToShow) {
          return Math.max(diff, 0) // show: 2; scroll: 3, n: 5 => -1
        }
        particlesCount += particlesToShow + overlap;
      }
    }

    function createResizeObserver(onResize) {
      return new ResizeObserver(entries => {
        onResize({
          width: entries[0].contentRect.width,
        });
      });
    }

    function getClones({
      clonesCountHead,
      clonesCountTail,
      particlesContainerChildren,
    }) {
      // TODO: add fns to remove clones if needed
      const clonesToAppend = [];
      for (let i=0; i<clonesCountTail; i++) {
        clonesToAppend.push(particlesContainerChildren[i].cloneNode(true));
      }

      const clonesToPrepend = [];
      const len = particlesContainerChildren.length;
      for (let i=len-1; i>len-1-clonesCountHead; i--) {
        clonesToPrepend.push(particlesContainerChildren[i].cloneNode(true));
      }

      return {
        clonesToAppend,
        clonesToPrepend,
      }
    }

    function applyClones({
      particlesContainer,
      clonesToAppend,
      clonesToPrepend,
    }) {
      for (let i=0; i<clonesToAppend.length; i++) {
        particlesContainer.append(clonesToAppend[i]);
      }
      for (let i=0; i<clonesToPrepend.length; i++) {
        particlesContainer.prepend(clonesToPrepend[i]);
      }
    }

    function getClonesCount({
      infinite,
      particlesToShow,
      partialPageSize,
    }) {
      const clonesCount = infinite
        ? {
          // need to round with ceil as particlesToShow, particlesToShow can be floating (e.g. 1.5, 3.75)
          head: Math.ceil(partialPageSize || particlesToShow),
          tail: Math.ceil(particlesToShow),
        } : {
          head: 0,
          tail: 0,
        };

      return {
        ...clonesCount,
        total: clonesCount.head + clonesCount.tail,
      }
    }

    const get$1 = (object, fieldName, defaultValue) => {
      if (object && object.hasOwnProperty(fieldName)) {
        return object[fieldName]
      }
      if (defaultValue === undefined) {
        throw new Error(`Required arg "${fieldName}" was not provided`)
      }
      return defaultValue
    };

    const switcher = (description) => (key) => {
      description[key] && description[key]();
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /** `Object#toString` result references. */
    var funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        symbolTag = '[object Symbol]';

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/,
        reLeadingDot = /^\./,
        rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */
    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;
      if (value != null && typeof value.toString != 'function') {
        try {
          result = !!(value + '');
        } catch (e) {}
      }
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Symbol$1 = root.Symbol,
        splice = arrayProto.splice;

    /* Built-in method references that are verified to be native. */
    var Map$1 = getNative(root, 'Map'),
        nativeCreate = getNative(Object, 'create');

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map$1 || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = isKey(path, object) ? [path] : castPath(path);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoize(function(string) {
      string = toString(string);

      var result = [];
      if (reLeadingDot.test(string)) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    var lodash_get = get;

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    var lodash_clonedeep = createCommonjsModule(function (module, exports) {
    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to match `RegExp` flags from their coerced string values. */
    var reFlags = /\w*$/;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] =
    cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
    cloneableTags[boolTag] = cloneableTags[dateTag] =
    cloneableTags[float32Tag] = cloneableTags[float64Tag] =
    cloneableTags[int8Tag] = cloneableTags[int16Tag] =
    cloneableTags[int32Tag] = cloneableTags[mapTag] =
    cloneableTags[numberTag] = cloneableTags[objectTag] =
    cloneableTags[regexpTag] = cloneableTags[setTag] =
    cloneableTags[stringTag] = cloneableTags[symbolTag] =
    cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
    cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] =
    cloneableTags[weakMapTag] = false;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /**
     * Adds the key-value `pair` to `map`.
     *
     * @private
     * @param {Object} map The map to modify.
     * @param {Array} pair The key-value pair to add.
     * @returns {Object} Returns `map`.
     */
    function addMapEntry(map, pair) {
      // Don't return `map.set` because it's not chainable in IE 11.
      map.set(pair[0], pair[1]);
      return map;
    }

    /**
     * Adds `value` to `set`.
     *
     * @private
     * @param {Object} set The set to modify.
     * @param {*} value The value to add.
     * @returns {Object} Returns `set`.
     */
    function addSetEntry(set, value) {
      // Don't return `set.add` because it's not chainable in IE 11.
      set.add(value);
      return set;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array ? array.length : 0;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
          length = array ? array.length : 0;

      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */
    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;
      if (value != null && typeof value.toString != 'function') {
        try {
          result = !!(value + '');
        } catch (e) {}
      }
      return result;
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
        Symbol = root.Symbol,
        Uint8Array = root.Uint8Array,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object);

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, 'DataView'),
        Map = getNative(root, 'Map'),
        Promise = getNative(root, 'Promise'),
        Set = getNative(root, 'Set'),
        WeakMap = getNative(root, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      return this.__data__['delete'](key);
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
      }
      cache.set(key, value);
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      // Safari 9 makes `arguments.length` enumerable in strict mode.
      var result = (isArray(value) || isArguments(value))
        ? baseTimes(value.length, String)
        : [];

      var length = result.length,
          skipIndexes = !!length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      return objectToString.call(value);
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        assignValue(object, key, newValue === undefined ? source[key] : newValue);
      }
      return object;
    }

    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * Creates an array of the own enumerable symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11,
    // for data views in Edge < 14, and promises in Node.js.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : undefined;

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    module.exports = cloneDeep;
    });

    /**
     * Lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright JS Foundation and other contributors <https://js.foundation/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    var lodash_isequal = createCommonjsModule(function (module, exports) {
    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
        COMPARE_UNORDERED_FLAG = 2;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        asyncTag = '[object AsyncFunction]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        nullTag = '[object Null]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        proxyTag = '[object Proxy]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        undefinedTag = '[object Undefined]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
    typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
    typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
    typedArrayTags[errorTag] = typedArrayTags[funcTag] =
    typedArrayTags[mapTag] = typedArrayTags[numberTag] =
    typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
    typedArrayTags[setTag] = typedArrayTags[stringTag] =
    typedArrayTags[weakMapTag] = false;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
        Symbol = root.Symbol,
        Uint8Array = root.Uint8Array,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object);

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, 'DataView'),
        Map = getNative(root, 'Map'),
        Promise = getNative(root, 'Promise'),
        Set = getNative(root, 'Set'),
        WeakMap = getNative(root, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    module.exports = isEqual;
    });

    const depsAreEqual = (deps1, deps2) => {
      return lodash_isequal(deps1, deps2)
    };

    const getDepNames = (deps) => {
      return Object.keys(deps || {})
    };

    const getUpdatedDeps = (depNames, currentData) => {
      const updatedDeps = {};
      depNames.forEach((depName) => {
        updatedDeps[depName] = currentData[depName];
      });
      return updatedDeps
    };

    const createSubscription = () => {
      const subscribers = {};

      const memoDependency = (target, dep) => {
        const { watcherName, fn } = target;
        const { prop, value } = dep;

        if (!subscribers[watcherName]) {
          subscribers[watcherName] = {
            deps: {},
            fn,
          };
        }
        subscribers[watcherName].deps[prop] = value;
      };

      return {
        subscribers,
        subscribe(target, dep) {
          if (target) {
            memoDependency(target, dep);
          }
        },
        notify(data, prop) {
          Object.entries(subscribers).forEach(([watchName, { deps, fn }]) => {
            const depNames = getDepNames(deps);

            if (depNames.includes(prop)) {
              const updatedDeps = getUpdatedDeps(depNames, data);
              if (!depsAreEqual(deps, updatedDeps)) {
                subscribers[watchName].deps = updatedDeps;
                fn();
              }
            }
          });
        },
      }
    };

    const createTargetWatcher = () => {
      let target = null;

      return {
        targetWatcher(watcherName, fn) {
          target = {
            watcherName,
            fn,
          };
          target.fn();
          target = null;
        },
        getTarget() {
          return target
        },
      }
    };

    function simplyReactive(entities, options) {
      const data = lodash_get(entities, 'data', {});
      const watch = lodash_get(entities, 'watch', {});
      const methods = lodash_get(entities, 'methods', {});
      const onChange = lodash_get(options, 'onChange', () => {});

      const { subscribe, notify, subscribers } = createSubscription();
      const { targetWatcher, getTarget } = createTargetWatcher();

      let _data;
      const _methods = {};
      const getContext = () => ({
        data: _data,
        methods: _methods,
      });

      let callingMethod = false;
      const methodWithFlags = (fn) => (...args) => {
        callingMethod = true;
        const result = fn(...args);
        callingMethod = false;
        return result
      };

      // init methods before data, as methods may be used in data
      Object.entries(methods).forEach(([methodName, methodItem]) => {
        _methods[methodName] = methodWithFlags((...args) =>
          methodItem(getContext(), ...args)
        );
        Object.defineProperty(_methods[methodName], 'name', { value: methodName });
      });

      _data = new Proxy(lodash_clonedeep(data), {
        get(target, prop) {
          if (getTarget() && !callingMethod) {
            subscribe(getTarget(), { prop, value: target[prop] });
          }
          return Reflect.get(...arguments)
        },
        set(target, prop, value) {
          // if value is the same, do nothing
          if (target[prop] === value) {
            return true
          }

          Reflect.set(...arguments);

          if (!getTarget()) {
            onChange && onChange(prop, value);
            notify(_data, prop);
          }

          return true
        },
      });

      Object.entries(watch).forEach(([watchName, watchItem]) => {
        targetWatcher(watchName, () => {
          watchItem(getContext());
        });
      });

      const output = [_data, _methods];
      output._internal = {
        _getSubscribers() {
          return subscribers
        },
      };

      return output
    }

    function getIndexesOfParticlesWithoutClonesInPage({
      pageIndex,
      particlesToShow,
      particlesToScroll,
      particlesCount,
    }) {
      const overlap = pageIndex === 0 ? 0 : particlesToShow - particlesToScroll;
      const from = pageIndex * particlesToShow - pageIndex * overlap;
      const to = from + Math.max(particlesToShow, particlesToScroll) - 1;
      const indexes = [];
      for (let i=from; i<=Math.min(particlesCount - 1, to); i++) {
        indexes.push(i);
      }
      return indexes
    }

    function getAdjacentIndexes({
      infinite,
      pageIndex,
      pagesCount,
      particlesCount,
      particlesToShow,
      particlesToScroll,
    }) {
      const _pageIndex = getValueInRange(0, pageIndex, pagesCount - 1);

      let rangeStart = _pageIndex - 1;
      let rangeEnd = _pageIndex + 1;

      rangeStart = infinite
        ? rangeStart < 0 ? pagesCount - 1 : rangeStart
        : Math.max(0, rangeStart);

      rangeEnd = infinite
        ? rangeEnd > pagesCount - 1 ? 0 : rangeEnd
        : Math.min(pagesCount - 1, rangeEnd);

      const pageIndexes = [...new Set([
        rangeStart,
        _pageIndex,
        rangeEnd,

        // because of these values outputs for infinite/non-infinites are the same
        0, // needed to clone first page particles
        pagesCount - 1, // needed to clone last page particles
      ])].sort((a, b) => a - b);
      const particleIndexes = pageIndexes.flatMap(
        pageIndex => getIndexesOfParticlesWithoutClonesInPage({
          pageIndex,
          particlesToShow,
          particlesToScroll,
          particlesCount,
        })
      );
      return {
        pageIndexes,
        particleIndexes: [...new Set(particleIndexes)].sort((a, b) => a - b),
      }
    }

    const setIntervalImmediate = (fn, ms) => {
      fn();
      return setInterval(fn, ms);
    };

    const STEP_MS = 35;
    const MAX_VALUE = 1;

    class ProgressManager {
      constructor({ onProgressValueChange }) {
        this._onProgressValueChange = onProgressValueChange;

        this._autoplayDuration;
        this._onProgressValueChange;
      
        this._interval;
        this._paused = false;
      }

      setAutoplayDuration(autoplayDuration) {
        this._autoplayDuration = autoplayDuration;
      }

      start(onFinish) {
        return new Promise((resolve) => {
          this.reset();

          const stepMs = Math.min(STEP_MS, Math.max(this._autoplayDuration, 1));
          let progress = -stepMs;
      
          this._interval = setIntervalImmediate(async () => {
            if (this._paused) {
              return
            }
            progress += stepMs;
      
            const value = progress / this._autoplayDuration;
            this._onProgressValueChange(value);
      
            if (value > MAX_VALUE) {
              this.reset();
              await onFinish();
              resolve();
            }
          }, stepMs);
        })
      }

      pause() {
        this._paused = true;
      }

      resume() {
        this._paused = false;
      }

      reset() {
        clearInterval(this._interval);
        this._onProgressValueChange(MAX_VALUE);
      }
    }

    function createCarousel(onChange) {
      const progressManager = new ProgressManager({
        onProgressValueChange: (value) => {
          onChange('progressValue', 1 - value);
        },
      });

      const reactive = simplyReactive(
        {
          data: {
            particlesCountWithoutClones: 0,
            particlesToShow: 1, // normalized
            particlesToShowInit: 1, // initial value
            particlesToScroll: 1, // normalized
            particlesToScrollInit: 1, // initial value
            particlesCount: 1,
            currentParticleIndex: 1,
            infinite: false,
            autoplayDuration: 1000,
            clonesCountHead: 0,
            clonesCountTail: 0,
            clonesCountTotal: 0,
            partialPageSize: 1,
            currentPageIndex: 1,
            pagesCount: 1,
            pauseOnFocus: false,
            focused: false,
            autoplay: false,
            autoplayDirection: 'next',
            disabled: false, // disable page change while animation is in progress
            durationMsInit: 1000,
            durationMs: 1000,
            offset: 0,
            particleWidth: 0,
            loaded: [],
          },
          watch: {
            setLoaded({ data }) {
              data.loaded = getAdjacentIndexes({
                infinite: data.infinite,
                pageIndex: data.currentPageIndex,
                pagesCount: data.pagesCount,
                particlesCount: data.particlesCountWithoutClones,
                particlesToShow: data.particlesToShow,
                particlesToScroll: data.particlesToScroll,
              }).particleIndexes;
            },
            setCurrentPageIndex({ data }) {
              data.currentPageIndex = getCurrentPageIndexByCurrentParticleIndex({
                currentParticleIndex: data.currentParticleIndex,
                particlesCount: data.particlesCount,
                clonesCountHead: data.clonesCountHead,
                clonesCountTotal: data.clonesCountTotal,
                infinite: data.infinite,
                particlesToScroll: data.particlesToScroll,
              });
            },
            setPartialPageSize({ data }) {
              data.partialPageSize = getPartialPageSize({
                particlesToScroll: data.particlesToScroll,
                particlesToShow: data.particlesToShow,
                particlesCountWithoutClones: data.particlesCountWithoutClones,
              });
            },
            setClonesCount({ data }) {
              const { head, tail } = getClonesCount({
                infinite: data.infinite,
                particlesToShow: data.particlesToShow,
                partialPageSize: data.partialPageSize,
              });
              data.clonesCountHead = head;
              data.clonesCountTail = tail;
              data.clonesCountTotal = head + tail;
            },
            setProgressManagerAutoplayDuration({ data }) {
              progressManager.setAutoplayDuration(data.autoplayDuration);
            },
            toggleProgressManager({ data: { pauseOnFocus, focused } }) {
              // as focused is in if block, it will not be put to deps, read them in data: {}
              if (pauseOnFocus) {
                if (focused) {
                  progressManager.pause();
                } else {
                  progressManager.resume();
                }
              }
            },
            initDuration({ data }) {
              data.durationMs = data.durationMsInit;
            },
            applyAutoplay({ data, methods: { _applyAutoplayIfNeeded } }) {
              // prevent _applyAutoplayIfNeeded to be called with watcher
              // to prevent its data added to deps
              data.autoplay && _applyAutoplayIfNeeded(data.autoplay);
            },
            setPagesCount({ data }) {
              data.pagesCount = getPagesCountByParticlesCount({
                infinite: data.infinite,
                particlesCountWithoutClones: data.particlesCountWithoutClones,
                particlesToScroll: data.particlesToScroll,
                particlesToShow: data.particlesToShow,
              });
            },
            setParticlesToShow({ data }) {
              data.particlesToShow = getValueInRange(
                1,
                data.particlesToShowInit,
                data.particlesCountWithoutClones
              );
            },
            setParticlesToScroll({ data }) {
              data.particlesToScroll = getValueInRange(
                1,
                data.particlesToScrollInit,
                data.particlesCountWithoutClones
              );
            },
          },
          methods: {
            _prev({ data }) {
              data.currentParticleIndex = getParticleIndexByPageIndex({
                infinite: data.infinite,
                pageIndex: data.currentPageIndex - 1,
                clonesCountHead: data.clonesCountHead,
                clonesCountTail: data.clonesCountTail,
                particlesToScroll: data.particlesToScroll,
                particlesCount: data.particlesCount,
                particlesToShow: data.particlesToShow,
              });
            },
            _next({ data }) {
              data.currentParticleIndex = getParticleIndexByPageIndex({
                infinite: data.infinite,
                pageIndex: data.currentPageIndex + 1,
                clonesCountHead: data.clonesCountHead,
                clonesCountTail: data.clonesCountTail,
                particlesToScroll: data.particlesToScroll,
                particlesCount: data.particlesCount,
                particlesToShow: data.particlesToShow,
              });
            },
            _moveToParticle({ data }, particleIndex) {
              data.currentParticleIndex = getValueInRange(
                0,
                particleIndex,
                data.particlesCount - 1
              );
            },
            toggleFocused({ data }) {
              data.focused = !data.focused;
            },
            async _applyAutoplayIfNeeded({ data, methods }) {
              // prevent progress change if not infinite for first and last page
              if (
                !data.infinite &&
                ((data.autoplayDirection === NEXT &&
                  data.currentParticleIndex === data.particlesCount - 1) ||
                  (data.autoplayDirection === PREV &&
                    data.currentParticleIndex === 0))
              ) {
                progressManager.reset();
                return
              }

              if (data.autoplay) {
                const onFinish = () =>
                  switcher({
                    [NEXT]: async () => methods.showNextPage(),
                    [PREV]: async () => methods.showPrevPage(),
                  })(data.autoplayDirection);

                await progressManager.start(onFinish);
              }
            },
            // makes delayed jump to 1st or last element
            async _jumpIfNeeded({ data, methods }) {
              let jumped = false;
              if (data.infinite) {
                if (data.currentParticleIndex === 0) {
                  await methods.showParticle(
                    data.particlesCount - data.clonesCountTotal,
                    {
                      animated: false,
                    }
                  );
                  jumped = true;
                } else if (
                  data.currentParticleIndex ===
                  data.particlesCount - data.clonesCountTail
                ) {
                  await methods.showParticle(data.clonesCountHead, {
                    animated: false,
                  });
                  jumped = true;
                }
              }
              return jumped
            },
            async changePage({ data, methods }, updateStoreFn, options) {
              progressManager.reset();
              if (data.disabled) return
              data.disabled = true;

              updateStoreFn();
              await methods.offsetPage({ animated: get$1(options, 'animated', true) });
              data.disabled = false;

              const jumped = await methods._jumpIfNeeded();
              !jumped && methods._applyAutoplayIfNeeded(); // no need to wait it finishes
            },
            async showNextPage({ data, methods }, options) {
              if (data.disabled) return
              await methods.changePage(methods._next, options);
            },
            async showPrevPage({ data, methods }, options) {
              if (data.disabled) return
              await methods.changePage(methods._prev, options);
            },
            async showParticle({ methods }, particleIndex, options) {
              await methods.changePage(
                () => methods._moveToParticle(particleIndex),
                options
              );
            },
            _getParticleIndexByPageIndex({ data }, pageIndex) {
              return getParticleIndexByPageIndex({
                infinite: data.infinite,
                pageIndex,
                clonesCountHead: data.clonesCountHead,
                clonesCountTail: data.clonesCountTail,
                particlesToScroll: data.particlesToScroll,
                particlesCount: data.particlesCount,
                particlesToShow: data.particlesToShow,
              })
            },
            async showPage({ methods }, pageIndex, options) {
              const particleIndex = methods._getParticleIndexByPageIndex(pageIndex);
              await methods.showParticle(particleIndex, options);
            },
            offsetPage({ data }, options) {
              const animated = get$1(options, 'animated', true);
              return new Promise((resolve) => {
                // durationMs is an offset animation time
                data.durationMs = animated ? data.durationMsInit : 0;
                data.offset = -data.currentParticleIndex * data.particleWidth;
                setTimeout(() => {
                  resolve();
                }, data.durationMs);
              })
            },
          },
        },
        {
          onChange,
        }
      );
      const [data, methods] = reactive;

      return [{ data, progressManager }, methods, reactive._internal]
    }

    /* node_modules/svelte-carousel/src/components/Carousel/Carousel.svelte generated by Svelte v3.55.1 */

    const { Error: Error_1 } = globals;
    const file$2 = "node_modules/svelte-carousel/src/components/Carousel/Carousel.svelte";

    const get_dots_slot_changes = dirty => ({
    	currentPageIndex: dirty[0] & /*currentPageIndex*/ 32,
    	pagesCount: dirty[0] & /*pagesCount*/ 1024,
    	loaded: dirty[0] & /*loaded*/ 64
    });

    const get_dots_slot_context = ctx => ({
    	currentPageIndex: /*currentPageIndex*/ ctx[5],
    	pagesCount: /*pagesCount*/ ctx[10],
    	showPage: /*handlePageChange*/ ctx[15],
    	loaded: /*loaded*/ ctx[6]
    });

    const get_next_slot_changes = dirty => ({
    	loaded: dirty[0] & /*loaded*/ 64,
    	currentPageIndex: dirty[0] & /*currentPageIndex*/ 32
    });

    const get_next_slot_context = ctx => ({
    	showNextPage: /*methods*/ ctx[14].showNextPage,
    	loaded: /*loaded*/ ctx[6],
    	currentPageIndex: /*currentPageIndex*/ ctx[5]
    });

    const get_default_slot_changes = dirty => ({
    	loaded: dirty[0] & /*loaded*/ 64,
    	currentPageIndex: dirty[0] & /*currentPageIndex*/ 32
    });

    const get_default_slot_context = ctx => ({
    	loaded: /*loaded*/ ctx[6],
    	currentPageIndex: /*currentPageIndex*/ ctx[5]
    });

    const get_prev_slot_changes = dirty => ({
    	loaded: dirty[0] & /*loaded*/ 64,
    	currentPageIndex: dirty[0] & /*currentPageIndex*/ 32
    });

    const get_prev_slot_context = ctx => ({
    	showPrevPage: /*methods*/ ctx[14].showPrevPage,
    	loaded: /*loaded*/ ctx[6],
    	currentPageIndex: /*currentPageIndex*/ ctx[5]
    });

    // (259:4) {#if arrows}
    function create_if_block_3(ctx) {
    	let current;
    	const prev_slot_template = /*#slots*/ ctx[37].prev;
    	const prev_slot = create_slot(prev_slot_template, ctx, /*$$scope*/ ctx[36], get_prev_slot_context);
    	const prev_slot_or_fallback = prev_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (prev_slot_or_fallback) {
    				prev_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prev_slot) {
    				if (prev_slot.p && (!current || dirty[0] & /*loaded, currentPageIndex*/ 96 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						prev_slot,
    						prev_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(prev_slot_template, /*$$scope*/ ctx[36], dirty, get_prev_slot_changes),
    						get_prev_slot_context
    					);
    				}
    			} else {
    				if (prev_slot_or_fallback && prev_slot_or_fallback.p && (!current || dirty[0] & /*infinite, currentPageIndex*/ 36)) {
    					prev_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prev_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prev_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(259:4) {#if arrows}",
    		ctx
    	});

    	return block;
    }

    // (260:60)           
    function fallback_block_2(ctx) {
    	let div;
    	let arrow;
    	let current;

    	arrow = new Arrow({
    			props: {
    				direction: "prev",
    				disabled: !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[5] === 0
    			},
    			$$inline: true
    		});

    	arrow.$on("click", /*showPrevPage*/ ctx[23]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(arrow.$$.fragment);
    			attr_dev(div, "class", "sc-carousel__arrow-container svelte-uwo0yk");
    			add_location(div, file$2, 260, 8, 6343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(arrow, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const arrow_changes = {};
    			if (dirty[0] & /*infinite, currentPageIndex*/ 36) arrow_changes.disabled = !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[5] === 0;
    			arrow.$set(arrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(arrow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(260:60)           ",
    		ctx
    	});

    	return block;
    }

    // (297:6) {#if autoplayProgressVisible}
    function create_if_block_2(ctx) {
    	let div;
    	let progress;
    	let current;

    	progress = new Progress({
    			props: { value: /*progressValue*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progress.$$.fragment);
    			attr_dev(div, "class", "sc-carousel-progress__container svelte-uwo0yk");
    			add_location(div, file$2, 297, 8, 7492);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progress, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progress_changes = {};
    			if (dirty[0] & /*progressValue*/ 128) progress_changes.value = /*progressValue*/ ctx[7];
    			progress.$set(progress_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progress);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(297:6) {#if autoplayProgressVisible}",
    		ctx
    	});

    	return block;
    }

    // (303:4) {#if arrows}
    function create_if_block_1(ctx) {
    	let current;
    	const next_slot_template = /*#slots*/ ctx[37].next;
    	const next_slot = create_slot(next_slot_template, ctx, /*$$scope*/ ctx[36], get_next_slot_context);
    	const next_slot_or_fallback = next_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (next_slot_or_fallback) next_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (next_slot_or_fallback) {
    				next_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (next_slot) {
    				if (next_slot.p && (!current || dirty[0] & /*loaded, currentPageIndex*/ 96 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						next_slot,
    						next_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(next_slot_template, /*$$scope*/ ctx[36], dirty, get_next_slot_changes),
    						get_next_slot_context
    					);
    				}
    			} else {
    				if (next_slot_or_fallback && next_slot_or_fallback.p && (!current || dirty[0] & /*infinite, currentPageIndex, pagesCount*/ 1060)) {
    					next_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(next_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(next_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (next_slot_or_fallback) next_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(303:4) {#if arrows}",
    		ctx
    	});

    	return block;
    }

    // (304:60)           
    function fallback_block_1(ctx) {
    	let div;
    	let arrow;
    	let current;

    	arrow = new Arrow({
    			props: {
    				direction: "next",
    				disabled: !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[5] === /*pagesCount*/ ctx[10] - 1
    			},
    			$$inline: true
    		});

    	arrow.$on("click", /*methods*/ ctx[14].showNextPage);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(arrow.$$.fragment);
    			attr_dev(div, "class", "sc-carousel__arrow-container svelte-uwo0yk");
    			add_location(div, file$2, 304, 8, 7714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(arrow, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const arrow_changes = {};
    			if (dirty[0] & /*infinite, currentPageIndex, pagesCount*/ 1060) arrow_changes.disabled = !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[5] === /*pagesCount*/ ctx[10] - 1;
    			arrow.$set(arrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(arrow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(304:60)           ",
    		ctx
    	});

    	return block;
    }

    // (315:2) {#if dots}
    function create_if_block(ctx) {
    	let current;
    	const dots_slot_template = /*#slots*/ ctx[37].dots;
    	const dots_slot = create_slot(dots_slot_template, ctx, /*$$scope*/ ctx[36], get_dots_slot_context);
    	const dots_slot_or_fallback = dots_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (dots_slot_or_fallback) dots_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (dots_slot_or_fallback) {
    				dots_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dots_slot) {
    				if (dots_slot.p && (!current || dirty[0] & /*currentPageIndex, pagesCount, loaded*/ 1120 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						dots_slot,
    						dots_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(dots_slot_template, /*$$scope*/ ctx[36], dirty, get_dots_slot_changes),
    						get_dots_slot_context
    					);
    				}
    			} else {
    				if (dots_slot_or_fallback && dots_slot_or_fallback.p && (!current || dirty[0] & /*pagesCount, currentPageIndex*/ 1056)) {
    					dots_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dots_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dots_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (dots_slot_or_fallback) dots_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(315:2) {#if dots}",
    		ctx
    	});

    	return block;
    }

    // (321:5)         
    function fallback_block(ctx) {
    	let dots_1;
    	let current;

    	dots_1 = new Dots({
    			props: {
    				pagesCount: /*pagesCount*/ ctx[10],
    				currentPageIndex: /*currentPageIndex*/ ctx[5]
    			},
    			$$inline: true
    		});

    	dots_1.$on("pageChange", /*pageChange_handler*/ ctx[41]);

    	const block = {
    		c: function create() {
    			create_component(dots_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dots_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dots_1_changes = {};
    			if (dirty[0] & /*pagesCount*/ 1024) dots_1_changes.pagesCount = /*pagesCount*/ ctx[10];
    			if (dirty[0] & /*currentPageIndex*/ 32) dots_1_changes.currentPageIndex = /*currentPageIndex*/ ctx[5];
    			dots_1.$set(dots_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dots_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dots_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dots_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(321:5)         ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div2;
    	let t0;
    	let div1;
    	let div0;
    	let swipeable_action;
    	let t1;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*arrows*/ ctx[1] && create_if_block_3(ctx);
    	const default_slot_template = /*#slots*/ ctx[37].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[36], get_default_slot_context);
    	let if_block1 = /*autoplayProgressVisible*/ ctx[3] && create_if_block_2(ctx);
    	let if_block2 = /*arrows*/ ctx[1] && create_if_block_1(ctx);
    	let if_block3 = /*dots*/ ctx[4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div0, "class", "sc-carousel__pages-container svelte-uwo0yk");
    			set_style(div0, "transform", "translateX(" + /*offset*/ ctx[8] + "px)");
    			set_style(div0, "transition-duration", /*durationMs*/ ctx[9] + "ms");
    			set_style(div0, "transition-timing-function", /*timingFunction*/ ctx[0]);
    			add_location(div0, file$2, 279, 6, 6800);
    			attr_dev(div1, "class", "sc-carousel__pages-window svelte-uwo0yk");
    			add_location(div1, file$2, 269, 4, 6592);
    			attr_dev(div2, "class", "sc-carousel__content-container svelte-uwo0yk");
    			add_location(div2, file$2, 257, 2, 6209);
    			attr_dev(div3, "class", "sc-carousel__carousel-container svelte-uwo0yk");
    			add_location(div3, file$2, 256, 0, 6160);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[39](div0);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			/*div1_binding*/ ctx[40](div1);
    			append_dev(div2, t2);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div3, t3);
    			if (if_block3) if_block3.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipeable_action = swipeable.call(null, div0, {
    						thresholdProvider: /*swipeable_function*/ ctx[38]
    					})),
    					listen_dev(div0, "swipeStart", /*handleSwipeStart*/ ctx[16], false, false, false),
    					listen_dev(div0, "swipeMove", /*handleSwipeMove*/ ctx[18], false, false, false),
    					listen_dev(div0, "swipeEnd", /*handleSwipeEnd*/ ctx[19], false, false, false),
    					listen_dev(div0, "swipeFailed", /*handleSwipeFailed*/ ctx[20], false, false, false),
    					listen_dev(div0, "swipeThresholdReached", /*handleSwipeThresholdReached*/ ctx[17], false, false, false),
    					action_destroyer(hoverable.call(null, div1)),
    					listen_dev(div1, "hovered", /*handleHovered*/ ctx[21], false, false, false),
    					action_destroyer(tappable.call(null, div1)),
    					listen_dev(div1, "tapped", /*handleTapped*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*arrows*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*arrows*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*loaded, currentPageIndex*/ 96 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[36], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*offset*/ 256) {
    				set_style(div0, "transform", "translateX(" + /*offset*/ ctx[8] + "px)");
    			}

    			if (!current || dirty[0] & /*durationMs*/ 512) {
    				set_style(div0, "transition-duration", /*durationMs*/ ctx[9] + "ms");
    			}

    			if (!current || dirty[0] & /*timingFunction*/ 1) {
    				set_style(div0, "transition-timing-function", /*timingFunction*/ ctx[0]);
    			}

    			if (swipeable_action && is_function(swipeable_action.update) && dirty[0] & /*pageWindowWidth*/ 2048) swipeable_action.update.call(null, {
    				thresholdProvider: /*swipeable_function*/ ctx[38]
    			});

    			if (/*autoplayProgressVisible*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*autoplayProgressVisible*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*arrows*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*arrows*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*dots*/ ctx[4]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*dots*/ 16) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div3, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[39](null);
    			if (if_block1) if_block1.d();
    			/*div1_binding*/ ctx[40](null);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carousel', slots, ['prev','default','next','dots']);
    	let loaded = [];
    	let currentPageIndex;
    	let progressValue;
    	let offset = 0;
    	let durationMs = 0;
    	let pagesCount = 1;

    	const [{ data, progressManager }, methods, service] = createCarousel((key, value) => {
    		switcher({
    			'currentPageIndex': () => $$invalidate(5, currentPageIndex = value),
    			'progressValue': () => $$invalidate(7, progressValue = value),
    			'offset': () => $$invalidate(8, offset = value),
    			'durationMs': () => $$invalidate(9, durationMs = value),
    			'pagesCount': () => $$invalidate(10, pagesCount = value),
    			'loaded': () => $$invalidate(6, loaded = value)
    		})(key);
    	});

    	const dispatch = createEventDispatcher();
    	let { timingFunction = 'ease-in-out' } = $$props;
    	let { arrows = true } = $$props;
    	let { infinite = true } = $$props;
    	let { initialPageIndex = 0 } = $$props;
    	let { duration = 500 } = $$props;
    	let { autoplay = false } = $$props;
    	let { autoplayDuration = 3000 } = $$props;
    	let { autoplayDirection = NEXT } = $$props;
    	let { pauseOnFocus = false } = $$props;
    	let { autoplayProgressVisible = false } = $$props;
    	let { dots = true } = $$props;
    	let { swiping = true } = $$props;
    	let { particlesToShow = 1 } = $$props;
    	let { particlesToScroll = 1 } = $$props;

    	async function goTo(pageIndex, options) {
    		const animated = get$1(options, 'animated', true);

    		if (typeof pageIndex !== 'number') {
    			throw new Error('pageIndex should be a number');
    		}

    		await methods.showPage(pageIndex, { animated });
    	}

    	async function goToPrev(options) {
    		const animated = get$1(options, 'animated', true);
    		await methods.showPrevPage({ animated });
    	}

    	async function goToNext(options) {
    		const animated = get$1(options, 'animated', true);
    		await methods.showNextPage({ animated });
    	}

    	let pageWindowWidth = 0;
    	let pageWindowElement;
    	let particlesContainer;

    	const pageWindowElementResizeObserver = createResizeObserver(({ width }) => {
    		$$invalidate(11, pageWindowWidth = width);
    		data.particleWidth = pageWindowWidth / data.particlesToShow;

    		applyParticleSizes({
    			particlesContainerChildren: particlesContainer.children,
    			particleWidth: data.particleWidth
    		});

    		methods.offsetPage({ animated: false });
    	});

    	function addClones() {
    		const { clonesToAppend, clonesToPrepend } = getClones({
    			clonesCountHead: data.clonesCountHead,
    			clonesCountTail: data.clonesCountTail,
    			particlesContainerChildren: particlesContainer.children
    		});

    		applyClones({
    			particlesContainer,
    			clonesToAppend,
    			clonesToPrepend
    		});
    	}

    	onMount(() => {
    		(async () => {
    			await tick();

    			if (particlesContainer && pageWindowElement) {
    				data.particlesCountWithoutClones = particlesContainer.children.length;
    				await tick();
    				data.infinite && addClones();

    				// call after adding clones
    				data.particlesCount = particlesContainer.children.length;

    				methods.showPage(initialPageIndex, { animated: false });
    				pageWindowElementResizeObserver.observe(pageWindowElement);
    			}
    		})();
    	});

    	onDestroy(() => {
    		pageWindowElementResizeObserver.disconnect();
    		progressManager.reset();
    	});

    	async function handlePageChange(pageIndex) {
    		await methods.showPage(pageIndex, { animated: true });
    	}

    	// gestures
    	function handleSwipeStart() {
    		if (!swiping) return;
    		data.durationMs = 0;
    	}

    	async function handleSwipeThresholdReached(event) {
    		if (!swiping) return;

    		await switcher({
    			[NEXT]: methods.showNextPage,
    			[PREV]: methods.showPrevPage
    		})(event.detail.direction);
    	}

    	function handleSwipeMove(event) {
    		if (!swiping) return;
    		data.offset += event.detail.dx;
    	}

    	function handleSwipeEnd() {
    		if (!swiping) return;
    		methods.showParticle(data.currentParticleIndex);
    	}

    	async function handleSwipeFailed() {
    		if (!swiping) return;
    		await methods.offsetPage({ animated: true });
    	}

    	function handleHovered(event) {
    		data.focused = event.detail.value;
    	}

    	function handleTapped() {
    		methods.toggleFocused();
    	}

    	function showPrevPage() {
    		methods.showPrevPage();
    	}

    	const writable_props = [
    		'timingFunction',
    		'arrows',
    		'infinite',
    		'initialPageIndex',
    		'duration',
    		'autoplay',
    		'autoplayDuration',
    		'autoplayDirection',
    		'pauseOnFocus',
    		'autoplayProgressVisible',
    		'dots',
    		'swiping',
    		'particlesToShow',
    		'particlesToScroll'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	const swipeable_function = () => pageWindowWidth / 3;

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			particlesContainer = $$value;
    			$$invalidate(13, particlesContainer);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			pageWindowElement = $$value;
    			$$invalidate(12, pageWindowElement);
    		});
    	}

    	const pageChange_handler = event => handlePageChange(event.detail);

    	$$self.$$set = $$props => {
    		if ('timingFunction' in $$props) $$invalidate(0, timingFunction = $$props.timingFunction);
    		if ('arrows' in $$props) $$invalidate(1, arrows = $$props.arrows);
    		if ('infinite' in $$props) $$invalidate(2, infinite = $$props.infinite);
    		if ('initialPageIndex' in $$props) $$invalidate(24, initialPageIndex = $$props.initialPageIndex);
    		if ('duration' in $$props) $$invalidate(25, duration = $$props.duration);
    		if ('autoplay' in $$props) $$invalidate(26, autoplay = $$props.autoplay);
    		if ('autoplayDuration' in $$props) $$invalidate(27, autoplayDuration = $$props.autoplayDuration);
    		if ('autoplayDirection' in $$props) $$invalidate(28, autoplayDirection = $$props.autoplayDirection);
    		if ('pauseOnFocus' in $$props) $$invalidate(29, pauseOnFocus = $$props.pauseOnFocus);
    		if ('autoplayProgressVisible' in $$props) $$invalidate(3, autoplayProgressVisible = $$props.autoplayProgressVisible);
    		if ('dots' in $$props) $$invalidate(4, dots = $$props.dots);
    		if ('swiping' in $$props) $$invalidate(30, swiping = $$props.swiping);
    		if ('particlesToShow' in $$props) $$invalidate(31, particlesToShow = $$props.particlesToShow);
    		if ('particlesToScroll' in $$props) $$invalidate(32, particlesToScroll = $$props.particlesToScroll);
    		if ('$$scope' in $$props) $$invalidate(36, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		tick,
    		createEventDispatcher,
    		Dots,
    		Arrow,
    		Progress,
    		NEXT,
    		PREV,
    		swipeable,
    		hoverable,
    		tappable,
    		applyParticleSizes,
    		createResizeObserver,
    		getClones,
    		applyClones,
    		get: get$1,
    		switcher,
    		createCarousel,
    		loaded,
    		currentPageIndex,
    		progressValue,
    		offset,
    		durationMs,
    		pagesCount,
    		data,
    		progressManager,
    		methods,
    		service,
    		dispatch,
    		timingFunction,
    		arrows,
    		infinite,
    		initialPageIndex,
    		duration,
    		autoplay,
    		autoplayDuration,
    		autoplayDirection,
    		pauseOnFocus,
    		autoplayProgressVisible,
    		dots,
    		swiping,
    		particlesToShow,
    		particlesToScroll,
    		goTo,
    		goToPrev,
    		goToNext,
    		pageWindowWidth,
    		pageWindowElement,
    		particlesContainer,
    		pageWindowElementResizeObserver,
    		addClones,
    		handlePageChange,
    		handleSwipeStart,
    		handleSwipeThresholdReached,
    		handleSwipeMove,
    		handleSwipeEnd,
    		handleSwipeFailed,
    		handleHovered,
    		handleTapped,
    		showPrevPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(6, loaded = $$props.loaded);
    		if ('currentPageIndex' in $$props) $$invalidate(5, currentPageIndex = $$props.currentPageIndex);
    		if ('progressValue' in $$props) $$invalidate(7, progressValue = $$props.progressValue);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('durationMs' in $$props) $$invalidate(9, durationMs = $$props.durationMs);
    		if ('pagesCount' in $$props) $$invalidate(10, pagesCount = $$props.pagesCount);
    		if ('timingFunction' in $$props) $$invalidate(0, timingFunction = $$props.timingFunction);
    		if ('arrows' in $$props) $$invalidate(1, arrows = $$props.arrows);
    		if ('infinite' in $$props) $$invalidate(2, infinite = $$props.infinite);
    		if ('initialPageIndex' in $$props) $$invalidate(24, initialPageIndex = $$props.initialPageIndex);
    		if ('duration' in $$props) $$invalidate(25, duration = $$props.duration);
    		if ('autoplay' in $$props) $$invalidate(26, autoplay = $$props.autoplay);
    		if ('autoplayDuration' in $$props) $$invalidate(27, autoplayDuration = $$props.autoplayDuration);
    		if ('autoplayDirection' in $$props) $$invalidate(28, autoplayDirection = $$props.autoplayDirection);
    		if ('pauseOnFocus' in $$props) $$invalidate(29, pauseOnFocus = $$props.pauseOnFocus);
    		if ('autoplayProgressVisible' in $$props) $$invalidate(3, autoplayProgressVisible = $$props.autoplayProgressVisible);
    		if ('dots' in $$props) $$invalidate(4, dots = $$props.dots);
    		if ('swiping' in $$props) $$invalidate(30, swiping = $$props.swiping);
    		if ('particlesToShow' in $$props) $$invalidate(31, particlesToShow = $$props.particlesToShow);
    		if ('particlesToScroll' in $$props) $$invalidate(32, particlesToScroll = $$props.particlesToScroll);
    		if ('pageWindowWidth' in $$props) $$invalidate(11, pageWindowWidth = $$props.pageWindowWidth);
    		if ('pageWindowElement' in $$props) $$invalidate(12, pageWindowElement = $$props.pageWindowElement);
    		if ('particlesContainer' in $$props) $$invalidate(13, particlesContainer = $$props.particlesContainer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*currentPageIndex*/ 32) {
    			{
    				dispatch('pageChange', currentPageIndex);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*infinite*/ 4) {
    			{
    				data.infinite = infinite;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*duration*/ 33554432) {
    			{
    				data.durationMsInit = duration;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*autoplay*/ 67108864) {
    			{
    				data.autoplay = autoplay;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*autoplayDuration*/ 134217728) {
    			{
    				data.autoplayDuration = autoplayDuration;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*autoplayDirection*/ 268435456) {
    			{
    				data.autoplayDirection = autoplayDirection;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*pauseOnFocus*/ 536870912) {
    			{
    				data.pauseOnFocus = pauseOnFocus;
    			}
    		}

    		if ($$self.$$.dirty[1] & /*particlesToShow*/ 1) {
    			{
    				data.particlesToShowInit = particlesToShow;
    			}
    		}

    		if ($$self.$$.dirty[1] & /*particlesToScroll*/ 2) {
    			{
    				data.particlesToScrollInit = particlesToScroll;
    			}
    		}
    	};

    	return [
    		timingFunction,
    		arrows,
    		infinite,
    		autoplayProgressVisible,
    		dots,
    		currentPageIndex,
    		loaded,
    		progressValue,
    		offset,
    		durationMs,
    		pagesCount,
    		pageWindowWidth,
    		pageWindowElement,
    		particlesContainer,
    		methods,
    		handlePageChange,
    		handleSwipeStart,
    		handleSwipeThresholdReached,
    		handleSwipeMove,
    		handleSwipeEnd,
    		handleSwipeFailed,
    		handleHovered,
    		handleTapped,
    		showPrevPage,
    		initialPageIndex,
    		duration,
    		autoplay,
    		autoplayDuration,
    		autoplayDirection,
    		pauseOnFocus,
    		swiping,
    		particlesToShow,
    		particlesToScroll,
    		goTo,
    		goToPrev,
    		goToNext,
    		$$scope,
    		slots,
    		swipeable_function,
    		div0_binding,
    		div1_binding,
    		pageChange_handler
    	];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				timingFunction: 0,
    				arrows: 1,
    				infinite: 2,
    				initialPageIndex: 24,
    				duration: 25,
    				autoplay: 26,
    				autoplayDuration: 27,
    				autoplayDirection: 28,
    				pauseOnFocus: 29,
    				autoplayProgressVisible: 3,
    				dots: 4,
    				swiping: 30,
    				particlesToShow: 31,
    				particlesToScroll: 32,
    				goTo: 33,
    				goToPrev: 34,
    				goToNext: 35
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get timingFunction() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timingFunction(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get arrows() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set arrows(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get infinite() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infinite(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initialPageIndex() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialPageIndex(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplay() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplay(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplayDuration() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplayDuration(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplayDirection() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplayDirection(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pauseOnFocus() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pauseOnFocus(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplayProgressVisible() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplayProgressVisible(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dots() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dots(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swiping() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swiping(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get particlesToShow() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set particlesToShow(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get particlesToScroll() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set particlesToScroll(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goTo() {
    		return this.$$.ctx[33];
    	}

    	set goTo(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goToPrev() {
    		return this.$$.ctx[34];
    	}

    	set goToPrev(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goToNext() {
    		return this.$$.ctx[35];
    	}

    	set goToNext(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MyXlTemp/MyXlTemp.svelte generated by Svelte v3.55.1 */
    const file$1 = "src/components/MyXlTemp/MyXlTemp.svelte";

    // (35:16) <Text weight={500} size='xl' position='right'>
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Temperatur");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(35:16) <Text weight={500} size='xl' position='right'>",
    		ctx
    	});

    	return block;
    }

    // (36:16) <ActionIcon size={20} variant="light" >
    function create_default_slot_14(ctx) {
    	let hamburgermenu;
    	let current;
    	hamburgermenu = new HamburgerMenu$1({ props: { size: 20 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(hamburgermenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hamburgermenu, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburgermenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburgermenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hamburgermenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(36:16) <ActionIcon size={20} variant=\\\"light\\\" >",
    		ctx
    	});

    	return block;
    }

    // (34:12) <Group position='apart'>
    function create_default_slot_13(ctx) {
    	let text_1;
    	let t;
    	let actionicon;
    	let current;

    	text_1 = new Text$1({
    			props: {
    				weight: 500,
    				size: "xl",
    				position: "right",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon = new ActionIcon$1({
    			props: {
    				size: 20,
    				variant: "light",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    			t = space();
    			create_component(actionicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(actionicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const actionicon_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				actionicon_changes.$$scope = { dirty, ctx };
    			}

    			actionicon.$set(actionicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			transition_in(actionicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			transition_out(actionicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(actionicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(34:12) <Group position='apart'>",
    		ctx
    	});

    	return block;
    }

    // (40:20) <Text style='font-size:100px;padding-left:25px;'>
    function create_default_slot_12(ctx) {
    	let t_value = /*values*/ ctx[2][/*selectorIndex*/ ctx[0]].temp + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectorIndex*/ 1 && t_value !== (t_value = /*values*/ ctx[2][/*selectorIndex*/ ctx[0]].temp + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(40:20) <Text style='font-size:100px;padding-left:25px;'>",
    		ctx
    	});

    	return block;
    }

    // (41:20) <Text size='xl'>
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("°C");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(41:20) <Text size='xl'>",
    		ctx
    	});

    	return block;
    }

    // (39:16) <Group position='center' direction="row">
    function create_default_slot_10(ctx) {
    	let text0;
    	let t;
    	let text1;
    	let current;

    	text0 = new Text$1({
    			props: {
    				style: "font-size:100px;padding-left:25px;",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text$1({
    			props: {
    				size: "xl",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text0.$$.fragment);
    			t = space();
    			create_component(text1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(text1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text0_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(text1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(39:16) <Group position='center' direction=\\\"row\\\">",
    		ctx
    	});

    	return block;
    }

    // (44:20) <Text style='font-size:50px;padding-left:25px;'>
    function create_default_slot_9(ctx) {
    	let t_value = /*values*/ ctx[2][/*selectorIndex*/ ctx[0]].humi + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectorIndex*/ 1 && t_value !== (t_value = /*values*/ ctx[2][/*selectorIndex*/ ctx[0]].humi + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(44:20) <Text style='font-size:50px;padding-left:25px;'>",
    		ctx
    	});

    	return block;
    }

    // (45:20) <Text size='xl'>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("%");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(45:20) <Text size='xl'>",
    		ctx
    	});

    	return block;
    }

    // (43:16) <Group position='center' direction="row">
    function create_default_slot_7(ctx) {
    	let text0;
    	let t;
    	let text1;
    	let current;

    	text0 = new Text$1({
    			props: {
    				style: "font-size:50px;padding-left:25px;",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text$1({
    			props: {
    				size: "xl",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text0.$$.fragment);
    			t = space();
    			create_component(text1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(text1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text0_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(text1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(43:16) <Group position='center' direction=\\\"row\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:12) <Group position='center' direction="column">
    function create_default_slot_6(ctx) {
    	let group0;
    	let t;
    	let group1;
    	let current;

    	group0 = new Group$1({
    			props: {
    				position: "center",
    				direction: "row",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	group1 = new Group$1({
    			props: {
    				position: "center",
    				direction: "row",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(group0.$$.fragment);
    			t = space();
    			create_component(group1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(group0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(group1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const group0_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				group0_changes.$$scope = { dirty, ctx };
    			}

    			group0.$set(group0_changes);
    			const group1_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				group1_changes.$$scope = { dirty, ctx };
    			}

    			group1.$set(group1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(group0.$$.fragment, local);
    			transition_in(group1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(group0.$$.fragment, local);
    			transition_out(group1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(group0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(group1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(38:12) <Group position='center' direction=\\\"column\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:16) <ActionIcon variant="light" on:click={selectorBw}>
    function create_default_slot_5(ctx) {
    	let caretleft;
    	let current;
    	caretleft = new CaretLeft$1({ props: { size: 20 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(caretleft.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caretleft, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caretleft.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caretleft.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caretleft, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(53:16) <ActionIcon variant=\\\"light\\\" on:click={selectorBw}>",
    		ctx
    	});

    	return block;
    }

    // (57:20) <Text align='center'>
    function create_default_slot_4(ctx) {
    	let t_value = /*values*/ ctx[2][/*selectorIndex*/ ctx[0]].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectorIndex*/ 1 && t_value !== (t_value = /*values*/ ctx[2][/*selectorIndex*/ ctx[0]].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(57:20) <Text align='center'>",
    		ctx
    	});

    	return block;
    }

    // (59:16) <ActionIcon  variant="light" on:click={selectorFw}>
    function create_default_slot_3$1(ctx) {
    	let caretright;
    	let current;
    	caretright = new CaretRight$1({ props: { size: 20 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(caretright.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caretright, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caretright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caretright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caretright, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(59:16) <ActionIcon  variant=\\\"light\\\" on:click={selectorFw}>",
    		ctx
    	});

    	return block;
    }

    // (52:12) <Group position="center" spacing="xl" >
    function create_default_slot_2$1(ctx) {
    	let actionicon0;
    	let t0;
    	let div;
    	let text_1;
    	let t1;
    	let actionicon1;
    	let current;

    	actionicon0 = new ActionIcon$1({
    			props: {
    				variant: "light",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon0.$on("click", /*selectorBw*/ ctx[4]);

    	text_1 = new Text$1({
    			props: {
    				align: "center",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon1 = new ActionIcon$1({
    			props: {
    				variant: "light",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionicon1.$on("click", /*selectorFw*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(actionicon0.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(text_1.$$.fragment);
    			t1 = space();
    			create_component(actionicon1.$$.fragment);
    			set_style(div, "width", "100px");
    			add_location(div, file$1, 55, 16, 2263);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionicon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(text_1, div, null);
    			insert_dev(target, t1, anchor);
    			mount_component(actionicon1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionicon0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				actionicon0_changes.$$scope = { dirty, ctx };
    			}

    			actionicon0.$set(actionicon0_changes);
    			const text_1_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const actionicon1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				actionicon1_changes.$$scope = { dirty, ctx };
    			}

    			actionicon1.$set(actionicon1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionicon0.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			transition_in(actionicon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionicon0.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			transition_out(actionicon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionicon0, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(text_1);
    			if (detaching) detach_dev(t1);
    			destroy_component(actionicon1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(52:12) <Group position=\\\"center\\\" spacing=\\\"xl\\\" >",
    		ctx
    	});

    	return block;
    }

    // (33:8) <Stack>
    function create_default_slot_1$1(ctx) {
    	let group0;
    	let t0;
    	let group1;
    	let t1;
    	let space0;
    	let t2;
    	let group2;
    	let t3;
    	let space1;
    	let t4;
    	let group3;
    	let current;

    	group0 = new Group$1({
    			props: {
    				position: "apart",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	group1 = new Group$1({
    			props: {
    				position: "center",
    				direction: "column",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	space0 = new Space$1({ props: { h: 5 }, $$inline: true });

    	group2 = new Group$1({
    			props: { style: "height:55px;" },
    			$$inline: true
    		});

    	space1 = new Space$1({ props: { h: 5 }, $$inline: true });

    	group3 = new Group$1({
    			props: {
    				position: "center",
    				spacing: "xl",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(group0.$$.fragment);
    			t0 = space();
    			create_component(group1.$$.fragment);
    			t1 = space();
    			create_component(space0.$$.fragment);
    			t2 = space();
    			create_component(group2.$$.fragment);
    			t3 = space();
    			create_component(space1.$$.fragment);
    			t4 = space();
    			create_component(group3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(group0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(group1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(space0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(group2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(space1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(group3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const group0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				group0_changes.$$scope = { dirty, ctx };
    			}

    			group0.$set(group0_changes);
    			const group1_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				group1_changes.$$scope = { dirty, ctx };
    			}

    			group1.$set(group1_changes);
    			const group3_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				group3_changes.$$scope = { dirty, ctx };
    			}

    			group3.$set(group3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(group0.$$.fragment, local);
    			transition_in(group1.$$.fragment, local);
    			transition_in(space0.$$.fragment, local);
    			transition_in(group2.$$.fragment, local);
    			transition_in(space1.$$.fragment, local);
    			transition_in(group3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(group0.$$.fragment, local);
    			transition_out(group1.$$.fragment, local);
    			transition_out(space0.$$.fragment, local);
    			transition_out(group2.$$.fragment, local);
    			transition_out(space1.$$.fragment, local);
    			transition_out(group3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(group0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(group1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(space0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(group2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(space1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(group3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(33:8) <Stack>",
    		ctx
    	});

    	return block;
    }

    // (32:4) <Paper radius="md" withBorder override={MyXlCardShadow} >
    function create_default_slot$1(ctx) {
    	let stack;
    	let current;

    	stack = new Stack$1({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(32:4) <Paper radius=\\\"md\\\" withBorder override={MyXlCardShadow} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let paper;
    	let current;

    	paper = new Paper$1({
    			props: {
    				radius: "md",
    				withBorder: true,
    				override: /*MyXlCardShadow*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(paper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paper_changes = {};

    			if (dirty & /*$$scope, selectorIndex*/ 33) {
    				paper_changes.$$scope = { dirty, ctx };
    			}

    			paper.$set(paper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyXlTemp', slots, []);

    	const MyXlCardShadow = {
    		'$$gray': theme$1.colors['gray200'].value,
    		boxShadow: '0 1px 2px $$gray',
    		transition: 'all 0.2s ease-in-out',
    		'&:hover': { boxShadow: '0 1px 3px $$gray' }
    	};

    	let values = [
    		{ name: "Outdoor", temp: 24, humi: 40 },
    		{ name: "Wohnen", temp: 10, humi: 40 },
    		{ name: "Kind 1", temp: 24.4, humi: 40 },
    		{ name: "Kind 2", temp: 25, humi: 40 }
    	];

    	let selectorIndex = 0;

    	function selectorFw() {
    		if (selectorIndex == values.length - 1) {
    			$$invalidate(0, selectorIndex = 0);
    		} else {
    			$$invalidate(0, selectorIndex += 1);
    		}
    	}

    	function selectorBw() {
    		if (selectorIndex == 0) {
    			$$invalidate(0, selectorIndex = values.length - 1);
    		} else {
    			$$invalidate(0, selectorIndex -= 1);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyXlTemp> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Stack: Stack$1,
    		Paper: Paper$1,
    		Group: Group$1,
    		Text: Text$1,
    		Space: Space$1,
    		ActionIcon: ActionIcon$1,
    		theme: theme$1,
    		CaretLeft: CaretLeft$1,
    		CaretRight: CaretRight$1,
    		HamburgerMenu: HamburgerMenu$1,
    		MyXlCardShadow,
    		values,
    		selectorIndex,
    		selectorFw,
    		selectorBw
    	});

    	$$self.$inject_state = $$props => {
    		if ('values' in $$props) $$invalidate(2, values = $$props.values);
    		if ('selectorIndex' in $$props) $$invalidate(0, selectorIndex = $$props.selectorIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectorIndex, MyXlCardShadow, values, selectorFw, selectorBw];
    }

    class MyXlTemp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyXlTemp",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (43:3) <SimpleGrid cols={3} override={{margin:5}}>
    function create_default_slot_3(ctx) {
    	let myxltemp;
    	let t0;
    	let myxlbulb;
    	let t1;
    	let div;
    	let current;
    	myxltemp = new MyXlTemp({ $$inline: true });
    	myxlbulb = new MyXlBulb({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(myxltemp.$$.fragment);
    			t0 = space();
    			create_component(myxlbulb.$$.fragment);
    			t1 = space();
    			div = element("div");
    			div.textContent = "3";
    			add_location(div, file, 45, 4, 1792);
    		},
    		m: function mount(target, anchor) {
    			mount_component(myxltemp, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(myxlbulb, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(myxltemp.$$.fragment, local);
    			transition_in(myxlbulb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(myxltemp.$$.fragment, local);
    			transition_out(myxlbulb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(myxltemp, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(myxlbulb, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(43:3) <SimpleGrid cols={3} override={{margin:5}}>",
    		ctx
    	});

    	return block;
    }

    // (49:3) <SimpleGrid cols={3} override={{margin:5}}>
    function create_default_slot_2(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div2;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "4";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "5";
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "6";
    			add_location(div0, file, 49, 4, 1878);
    			add_location(div1, file, 50, 4, 1895);
    			add_location(div2, file, 51, 4, 1912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(49:3) <SimpleGrid cols={3} override={{margin:5}}>",
    		ctx
    	});

    	return block;
    }

    // (42:2) <Carousel>
    function create_default_slot_1(ctx) {
    	let simplegrid0;
    	let t;
    	let simplegrid1;
    	let current;

    	simplegrid0 = new SimpleGrid$1({
    			props: {
    				cols: 3,
    				override: { margin: 5 },
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	simplegrid1 = new SimpleGrid$1({
    			props: {
    				cols: 3,
    				override: { margin: 5 },
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(simplegrid0.$$.fragment);
    			t = space();
    			create_component(simplegrid1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(simplegrid0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(simplegrid1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const simplegrid0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				simplegrid0_changes.$$scope = { dirty, ctx };
    			}

    			simplegrid0.$set(simplegrid0_changes);
    			const simplegrid1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				simplegrid1_changes.$$scope = { dirty, ctx };
    			}

    			simplegrid1.$set(simplegrid1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(simplegrid0.$$.fragment, local);
    			transition_in(simplegrid1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(simplegrid0.$$.fragment, local);
    			transition_out(simplegrid1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(simplegrid0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(simplegrid1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(42:2) <Carousel>",
    		ctx
    	});

    	return block;
    }

    // (41:1) <SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver={'dark'}>
    function create_default_slot(ctx) {
    	let carousel;
    	let current;

    	carousel = new Carousel({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(carousel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(carousel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const carousel_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				carousel_changes.$$scope = { dirty, ctx };
    			}

    			carousel.$set(carousel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carousel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carousel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(carousel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(41:1) <SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver={'dark'}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let svelteuiprovider;
    	let current;

    	svelteuiprovider = new SvelteUIProvider$1({
    			props: {
    				withNormalizeCSS: true,
    				withGlobalStyles: true,
    				themeObserver: 'dark',
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(svelteuiprovider.$$.fragment);
    			attr_dev(main, "class", "svelte-3izk7w");
    			add_location(main, file, 39, 0, 1610);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(svelteuiprovider, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const svelteuiprovider_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				svelteuiprovider_changes.$$scope = { dirty, ctx };
    			}

    			svelteuiprovider.$set(svelteuiprovider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelteuiprovider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelteuiprovider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(svelteuiprovider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { uibsend } = $$props;
    	let { nrMsg = '' } = $$props;
    	let { myGreeting = 'Hello there from App.svelte! Send me a msg containing msg.greeting to replace this text.' } = $$props;

    	// Only runs when this component is being mounted (e.g. once, when the page is loaded)
    	onMount(() => {
    		// Start up the uibuilderfe library
    		uibuilder.start();

    		// A convenient send function that can be wired direct to events - defined as a prop above
    		$$invalidate(0, uibsend = uibuilder.eventSend);

    		// Listen for new messages from Node-RED/uibuilder
    		uibuilder.onChange('msg', function (msg) {
    			console.info('msg received from Node-RED server:', msg);

    			// Push an HTML highlighted visualisation of the msg to a prop so we can display it
    			$$invalidate(1, nrMsg = syntaxHighlight(msg));

    			// Update the greeting if present in the msg
    			if (msg.greeting) $$invalidate(2, myGreeting = msg.greeting);
    		});
    	}); // --- End of onMount --- //

    	$$self.$$.on_mount.push(function () {
    		if (uibsend === undefined && !('uibsend' in $$props || $$self.$$.bound[$$self.$$.props['uibsend']])) {
    			console_1.warn("<App> was created without expected prop 'uibsend'");
    		}
    	});

    	const writable_props = ['uibsend', 'nrMsg', 'myGreeting'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('uibsend' in $$props) $$invalidate(0, uibsend = $$props.uibsend);
    		if ('nrMsg' in $$props) $$invalidate(1, nrMsg = $$props.nrMsg);
    		if ('myGreeting' in $$props) $$invalidate(2, myGreeting = $$props.myGreeting);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		SvelteUIProvider: SvelteUIProvider$1,
    		MyXlBulb,
    		SimpleGrid: SimpleGrid$1,
    		Stack: Stack$1,
    		Space: Space$1,
    		Carousel,
    		MyXlTemp,
    		uibsend,
    		nrMsg,
    		myGreeting
    	});

    	$$self.$inject_state = $$props => {
    		if ('uibsend' in $$props) $$invalidate(0, uibsend = $$props.uibsend);
    		if ('nrMsg' in $$props) $$invalidate(1, nrMsg = $$props.nrMsg);
    		if ('myGreeting' in $$props) $$invalidate(2, myGreeting = $$props.myGreeting);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [uibsend, nrMsg, myGreeting];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { uibsend: 0, nrMsg: 1, myGreeting: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get uibsend() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uibsend(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nrMsg() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nrMsg(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get myGreeting() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set myGreeting(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {		
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
