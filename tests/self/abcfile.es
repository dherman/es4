/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is [Open Source Virtual Machine.].
 *
 * The Initial Developer of the Original Code is
 * Adobe System Incorporated.
 * Portions created by the Initial Developer are Copyright (C) 2004-2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Adobe AS3 Team
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

package es4 
{
    /* ABCFile container & helper class.
     *
     * Every argument to an addWhatever() method is retained by
     * reference.  When getBytes() is finally called, each object is
     * serialized.  The order of serialization is the order they will
     * have in the ABCFile, and the order among items of the same type
     * is the order in which they were added.
     */
    class ABCFile 
    {
        const major_version = 46;
        const minor_version = 16;

        function getBytes(): * /* same type as ABCByteStream.getBytes() */ {
            function emitArray(a) {
                bytes.uint30(a.length);
                for ( var i=0 ; i < a.length ; i++ )
                    a[i].serialize(bytes);
            }

            var bytes = new ABCByteStream;
            
            assert(constants);
            assert(scripts.length != 0);
            assert(methods.length != 0);
            assert(bodies.length != 0);

            bytes.uint16(minor_version);
            bytes.uint16(major_version);
            constants.serialize(bytes);
            emitArray(methods);
            emitArray(metadatas);
            emitArray(instances);
            emitArray(classes);
            emitArray(scripts);
            emitArray(bodies);

            return bytes.getBytes();
        }

        function addConstants(cpool/*: ABCConstantPool*/): void {
            constants = cpool;
        }

        function addMethod(m: ABCMethodInfo): uint {
            methods.push(m);
            return methods.length-1;
        }

        function addMetadata(m: ABCMetadataInfo): uint {
            metadatas.push(m);
            return metadatas.length-1;
        }

        function addInstance(i: ABCInstanceInfo): uint {
            instances.push(i);
            return instances.length-1;
        }

        function addClass(c: ABCClassInfo): uint {
            classes.push(c);
            return classes.length-1;
        }

        function addScript(s: ABCScriptInfo): uint {
            scripts.push(s);
            return scripts.length-1;
        }

        function addMethodBody(b: ABCMethodBodyInfo): uint {
            bodies.push(b);
            return bodies.length-1;
        }

        private const methods = [];
        private const metadatas = [];
        private const instances = [];
        private const classes = [];
        private const scripts = [];
        private const bodies = [];
        private var   constants;
    }

    class ABCMethodInfo 
    {
        /* \param name         string index
         * \param param_types  array of multiname indices.  May not be null.
         * \param return_type  multiname index.
         * \param flags        bitwise or of NEED_ARGUMENTS, NEED_ACTIVATION, HAS_REST, SET_DXNS
         * \param options      [{val:uint, kind:uint}], if present.
         * \param param_names  array of param_info structures, if present.
         */
        function ABCMethodInfo(name:uint, param_types:Array, return_type:uint, flags:uint, 
                               options:Array=null, param_names:Array=null) {
            this.name = name;
            this.param_types = param_types;
            this.return_type = return_type;
            this.flags = flags;
            this.options = options;
            this.param_names = param_names;
        }

        function serialize(bs) {
            var i;
            bs.uint30(param_types.length);
            bs.uint30(return_type);
            for ( i=0 ; i < param_types.length ; i++ )
                bs.uint30(param_types[i]);
            bs.uint30(name);
            if (options != null)
                flags |= METHOD_HasOptional;
            if (param_names != null)
                flags |= METHOD_HasParamNames;
            bs.uint8(flags);
            if (options != null) {
                bs.uint30(options.length);
                for ( i=0 ; i < options.length ; i++ ) {
                    bs.uint30(options[i].val);
                    bs.uint8(options[i].kind);
                }
            }
            if (param_names != null) {
                assert( param_names.length == param_types.length );
                for ( i=0 ; i < param_names.length ; i++ )
                    bs.uint30(param_names[i]);
            }
        }

        private var name, param_types, return_type, flags, options, param_names;
    }

    class ABCMetadataInfo 
    {
        function ABCMetadataInfo( name: uint, items: Array ) {
            assert( name != 0 );
            this.name = name;
            this.items = items;
        }

        function serialize(bs) {
            bs.uint30(name);
            bs.uint30(items.length);
            for ( var i=0 ; i < items.length ; i++ ) {
                bs.uint30(items.key);
                bs.uint30(items.value);
            }
        }

        private var name, items;
    }

    class ABCInstanceInfo
    {
        function ABCInstanceInfo(name, super_name, flags, protectedNS, interfaces) {
            this.name = name;
            this.super_name = name;
            this.flags = flags;
            this.protectedNS = protectedNS;
            this.interfaces = interfaces;
            this.traits = [];
        }

        function setIInit(x) {
            iinit = x;
        }

        function addTrait(t) {
            traits.push(t);
            return traits.length-1;
        }

        function serialize(bs) {
            var i;

            assert( iinit != undefined );

            bs.uint30(name);
            bs.uint30(super_name);
            bs.uint8(flags);
            if (flags & CONSTANT_ClassProtectedNs)
                bs.uint30(protectedNS);
            bs.uint30(interfaces.length);
            for ( i=0 ; i < interfaces.length ; i++ ) {
                assert( interfaces[i] != 0 );
                bs.uint30(interfaces[i]);
            }
            bs.uint30(iinit);
            bs.uint30(traits.length);
            for ( i=0 ; i < traits.length ; i++ )
                traits[i].serialize(bs);
        }

        private var name, super_name, flags, protectedNS, interfaces, iinit, traits;
    }

    class ABCTrait 
    {
        function ABCTrait(name, kind) {
            this.name = name;
            this.kind = kind;
        }

        function addMetadata(n) {
            metadata.push(n);
            return metadata.length-1;
        }

        function inner_serialize(bs) {
            throw "ABSTRACT";
        }

        function serialize(bs) {
            if (metadata.length > 0)
                kind |= ATTR_Metadata;
            bs.uint30(name);
            bs.uint30(kind);
            this.inner_serialize(bs);
            if (metadata.length > 0) {
                bs.uint30(metadata.length);
                for ( var i=0 ; i < metadata.length ; i++ ) 
                    bs.uint30(metadata[i]);
            }
        }

        private var name, kind, metadata = [];
    }

    class ABCSlotTrait extends ABCTrait
    {
        function ABCSlotTrait(name, attrs, slot_id=0, type_name=0, vindex=0, vkind=0) {
            super(name, (attrs << 4) | TRAIT_Slot);
            this.slot_id = slot_id;
            this.type_name = type_name;
            this.vindex = vindex;
            this.vkind = vkind;
        }

        override function inner_serialize(bs) {
            bs.uint30(slot_id);
            bs.uint30(type_name);
            bs.uint30(vindex);
            if (vindex != 0)
                bs.uint8(vkind);
        }

        private var slot_id, type_name, vindex, vkind;
    }

    class ABCOtherTrait extends ABCTrait
    {
        /* TAG is one of the TRAIT_* values, except TRAIT_Slot */
        function ABCOtherTrait(name, attrs, tag, id, val) {
            super(name, (attrs << 4) | tag);
            this.id = id;
            this.val = val;
        }

        override function inner_serialize(bs) {
            bs.uint30(id);
            bs.uint30(val);
        }

        private var id, val;
    }

    class ABCClassInfo
    {
        function setCInit(cinit) {
            this.cinit = cinit;
        }

        function addTrait(t) {
            traits.push(t);
            return traits.length-1;
        }

        function serialize(bs) {
            assert( cinit != undefined );
            bs.uint30(cinit);
            bs.uint30(traits.length);
            for ( var i=0 ; i < traits.length ; i++ ) 
                traits[i].serialize(bs);
        }

        private var cinit, traits = [];
    }

    class ABCScriptInfo
    {
        function setInit(init) {
            this.init = init;
        }

        function addTrait(t) {
            traits.push(t);
            return traits.length-1;
        }

        function serialize(bs) {
            assert( init != undefined );
            bs.uint30(init);
            bs.uint30(traits.length);
            for ( var i=0 ; i < traits.length ; i++ ) 
                traits[i].serialize(bs);
        }

        private var init, traits = [];
    }

    class ABCMethodBodyInfo
    {
        function ABCMethodBodyInfo(method) {
            this.method = method;
        }
        function setMaxStack(ms) { max_stack = ms }
        function setLocalCount(lc) { local_count = lc }
        function setInitScopeDepth(sd) { init_scope_depth = sd }
        function setMaxScopeDepth(msd) { max_scope_depth = msd }
        function setCode(insns) { code = insns }

        function addException(exn) {
            exceptions.push(exn);
            return exceptions.length-1;
        }

        function addTrait(t) {
            traits.push(t);
            return traits.length-1;
        }

        function serialize(bs) {
            assert( max_stack != undefined && local_count != undefined );
            assert( init_scope_depth != undefined && max_scope_depth != undefined );
            assert( code != undefined );

            bs.uint30(method);
            bs.uint30(max_stack);
            bs.uint30(local_count);
            bs.uint30(init_scope_depth);
            bs.uint30(max_scope_depth);
            bs.uint30(code.length);
            for ( var i=0 ; i < code.length ; i++ )
                bs.uint8(code[i]);
            bs.uint30(exceptions.length);
            for ( var i=0 ; i < exceptions.length ; i++ )
                exceptions[i].serialize(bs);
            bs.uint30(traits.length);
            for ( var i=0 ; i < traits.length ; i++ )
                traits[i].serialize(bs);
        }

        private var method, max_stack, local_count, init_scope_depth, max_scope_depth, code, exceptions = [], traits = [];
    }

    class ABCException 
    {
        function ABCException(first_pc, last_pc, target_pc, exc_type=0, var_name=0) {
            this.first_pc = first_pc;
            this.last_pc = last_pc;
            this.target_pc = target_pc;
            this.exc_type = exc_type;
            this.var_name = var_name;
        }

        function serialize(bs) {
            bs.uint30(first_pc);
            bs.uint30(last_pc);
            bs.uint30(target_pc);
            bs.uint30(exc_type);
            bs.uint30(var_name);
        }

        private var first_pc, last_pc, target_pc, exc_type, var_name;
    }

    public function testABCFile() {
        var f = new ABCFile;
        var cp = new ABCConstantPool;
        f.addConstants(cp);
        var m = f.addMethod(new ABCMethodInfo(cp.stringUtf8("foo"), 
                                               [cp.Multiname(cp.namespaceset([cp.namespace(CONSTANT_ProtectedNamespace, 
                                                                                            cp.stringUtf8("bar"))]),
                                                             cp.stringUtf8("baz"))],
                                               0,
                                               0,
                                               [],
                                               [cp.stringUtf8("x")]));

        f.addMetadata(new ABCMetadataInfo(cp.stringUtf8("meta"), 
                                          [{key: cp.stringUtf8("fnord"), value: cp.stringUtf8("foo")}]));
        var cl = new ABCClassInfo();
        var cli = f.addClass(cl);
        cl.setCInit(0);

        var ii = new ABCInstanceInfo(cp.stringUtf8("foo"),
                                     0,
                                     0,
                                     0,
                                     []);
        f.addInstance(ii);
        ii.setIInit(0);
        ii.addTrait(new ABCSlotTrait(cp.stringUtf8("x"), 0));
        ii.addTrait(new ABCOtherTrait(cp.stringUtf8("y"), 0, TRAIT_Class, 0, cli));

        var sc = new ABCScriptInfo;
        f.addScript(sc);
        sc.setInit(0);

        var mb = new ABCMethodBodyInfo(0);
        f.addMethodBody(mb);
        mb.setMaxStack(0);
        mb.setLocalCount(0);
        mb.setInitScopeDepth(0);
        mb.setMaxScopeDepth(0);
        mb.setCode([]);
        
        f.getBytes();
    }
}