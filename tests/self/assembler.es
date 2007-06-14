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

    /*******************************************************************
     * ABC constants
     */

    const CONSTANT_Utf8               = 0x01;
    const CONSTANT_Integer            = 0x03;
    const CONSTANT_UInt               = 0x04;
    const CONSTANT_PrivateNamespace   = 0x05;
    const CONSTANT_Double             = 0x06;
    const CONSTANT_QName              = 0x07; // ns::name, const ns, const name
    const CONSTANT_Namespace          = 0x08;
    const CONSTANT_Multiname          = 0x09; // [ns...]::name, const [ns...], const name
    const CONSTANT_False              = 0x0A;
    const CONSTANT_True               = 0x0B;
    const CONSTANT_Null               = 0x0C;
    const CONSTANT_QNameA             = 0x0D; // @ns::name, const ns, const name
    const CONSTANT_MultinameA         = 0x0E; // @[ns...]::name, const [ns...], const name
    const CONSTANT_RTQName            = 0x0F; // ns::name, var ns, const name
    const CONSTANT_RTQNameA           = 0x10; // @ns::name, var ns, const name
    const CONSTANT_RTQNameL           = 0x11; // ns::[name], var ns, var name
    const CONSTANT_RTQNameLA          = 0x12; // @ns::[name], var ns, var name
    const CONSTANT_NameL              = 0x13; // o[name], var name
    const CONSTANT_NameLA             = 0x14; // @[name], var name
    const CONSTANT_NamespaceSet       = 0x15;
    const CONSTANT_PackageNamespace   = 0x16; // namespace for a package
    const CONSTANT_PackageInternalNS  = 0x17; 
    const CONSTANT_ProtectedNamespace = 0x18; 
    const CONSTANT_ExplicitNamespace  = 0x19;
    const CONSTANT_StaticProtectedNS  = 0x1A;
    const CONSTANT_MultinameL         = 0x1B;
    const CONSTANT_MultinameLA        = 0x1C;

    const TRAIT_Slot = 0;
    const TRAIT_Method = 1;
    const TRAIT_Getter = 2;
    const TRAIT_Setter = 3;
    const TRAIT_Class = 4;
    const TRAIT_Function = 5;
    const TRAIT_Const = 6;

    const ATTR_Final = 0x01;
    const ATTR_Override = 0x02;
    const ATTR_Metadata = 0x04;

    const SLOT_var      = 0;
    const SLOT_method   = 1;
    const SLOT_getter   = 2;
    const SLOT_setter   = 3;
    const SLOT_class    = 4;
    const SLOT_function = 6;
    
    const METHOD_Arguments     = 0x1;
    const METHOD_Activation    = 0x2;
    const METHOD_Needrest      = 0x4;
    const METHOD_HasOptional   = 0x8;
    const METHOD_IgnoreRest    = 0x10;
    const METHOD_Native        = 0x20;
    const METHOD_Setsdxns      = 0x40;
    const METHOD_HasParamNames = 0x80;

    const CONSTANT_ClassSealed = 0x01;
    const CONSTANT_ClassFinal  = 0x02;
    const CONSTANT_ClassInterface = 0x04;
    const CONSTANT_ClassProtectedNs = 0x08;


    /*********************************************************************************
     * Assembler for one code block.
     *
     * This is a lightweight class that is used to emit bytes for
     * instructions and data, and to maintain stack and scope depths,
     * but which has no code generation logic save for simple
     * abstractions (eg, GetLocal maps to GetLocalN or to the general
     * GetLocal instruction, depending on its parameter value).
     */
    final class ABCAssembler 
    {
        function ABCAssembler(constants, numberOfFormals) {
            this.constants = constants;
            this.nextTemp = numberOfFormals;
        }

        private function list(name, ...rest) {
            print(name + " " + rest.join(" "));
        }

        // Instructions that push one value, with a single opcode byte
        private function pushOne(name, opcode) {
            stack(1);
            list(name);
            code.uint8(opcode);
        }

        function I_dup() { pushOne("dup", 0x2A) }
        function I_getglobalscope() { pushOne("getglobalscope", 0x64) }
        function I_getlocal_0() { pushOne("getlocal_0", 0xD0) }
        function I_getlocal_1() { pushOne("getlocal_1", 0xD1) }
        function I_getlocal_2() { pushOne("getlocal_2", 0xD2) }
        function I_getlocal_3() { pushOne("getlocal_3", 0xD3) }
        function I_newactivation() { pushOne("newactivation", 0x57) }
        function I_pushfalse() { pushOne("pushfalse", 0x27) }
        function I_pushnan() { pushOne("pushnan", 0x28) }
        function I_pushnull() { pushOne("pushnull", 0x20) }
        function I_pushtrue() { pushOne("pushtrue", 0x26) }
        function I_pushundefined() { pushOne("pushundefined", 0x21) }

        // Instructions that push one value, with an opcode byte followed by a u30 argument
        private function pushOneU30(name, opcode, v) {
            stack(1);
            list(name);
            code.uint8(opcode);
            code.uint30(v);
        }

        function I_getglobalslot(index) { pushOneU30("getglobalslot", 0x6E, index) }
        function I_getlex(index) { pushOneU30("getlex", 0x60, index) }
        function I_getlocal(index) { pushOneU30("getlocal", 0x62, index) }
        function I_getscopeobject(index) { pushOneU30("getscopeobject", 0x65, index) }
        function I_newcatch(index) { pushOneU30("newcatch", 0x5A, index) }
        function I_newfunction(index) { pushOneU30("newfunction", 0x40, index) }
        function I_pushdouble(index) { pushOneU30("pushdouble", 0x2F, index) }
        function I_pushint(index) { pushOneU30("pushint", 0x2D, index) }
        function I_pushnamespace(index) { pushOneU30("pushnamespace", 0x31, index) }
        function I_pushshort(v) { pushOneU30("pushshort", 0x25, v) }
        function I_pushstring(index) { pushOneU30("pushstring", 0x2C, index) }
        function I_pushuint(index) { pushOneU30("pushuint", 0x2E, index) }

        // Instructions that pop one value, with a single opcode byte
        private function dropOne(name, opcode) {
            stack(-1);
            list(name);
            code.uint8(opcode);
        }

        function I_add() { dropOne("add", 0xA0) }
        function I_add_i() { dropOne("add_i", 0xC5) }
        function I_astypelate() { dropOne("astypelate", 0x87) }
        function I_bitand() { dropOne("bitand", 0xA8) }
        function I_bitor() { dropOne("bitor", 0xA9) }
        function I_bitxor() { dropOne("bitxor", 0xAA) }
        function I_divide() { dropOne("divide", 0xA3) }
        function I_dxnslate() { dropOne("dxnslate", 0x07) }
        function I_equals() { dropOne("Equals", 0xAB) }
        function I_greaterequals() { dropOne("greaterequals", 0xB0) }
        function I_greaterthan() { dropOne("greaterthan", 0xAF) }
        function I_hasnext() { dropOne("hasnext", 0x1F) }
        function I_in() { dropOne("in", 0xB4) }
        function I_instanceof() { dropOne("instanceof", 0xB1) }
        function I_istypelate() { dropOne("istypelate", 0xB3) }
        function I_lessequals() { dropOne("lessequals", 0xAE) } 
        function I_lessthan() { dropOne("lessthan", 0xAD) }
        function I_lshift() { dropOne("lshift", 0xA5) }
        function I_modulo() { dropOne("modulo", 0xA4) }
        function I_multiply() { dropOne("multiply", 0xA2) }
        function I_multiply_i() { dropOne("multiply_i", 0xC7) }
        function I_nextname() { dropOne("nextname", 0x1E) }
        function I_nextvalue() { dropOne("nextvalue", 0x23) }
        function I_pop() { dropOne("pop", 0x29) }
        function I_pushscope() { dropOne("pushscope", 0x30) }
        function I_pushwith() { dropOne("pushwith", 0x1C) }
        function I_returnvalue() { dropOne("returnvalue", 0x48) }
        function I_rshift() { dropOne("rshift", 0xA6) }
        function I_setlocal_0() { dropOne("setlocal_0", 0xD4) }
        function I_setlocal_1() { dropOne("setlocal_1", 0xD5) }
        function I_setlocal_2() { dropOne("setlocal_2", 0xD6) }
        function I_setlocal_3() { dropOne("setlocal_3", 0xD7) }
        function I_strictequals() { dropOne("strictequals", 0xAC) }
        function I_subtract() { dropOne("subtract", 0xA1) }
        function I_subtract_i() { dropOne("subtract_i", 0xC6) }
        function I_throw() { dropOne("throw", 0x03) }
        function I_urshift() { dropOne("urshift", 0xA7) }

        // Instructions that pop one value, with an opcode byte followed by an u30 argument
        private function dropOneU30(name, opcode, v) {
            stack(-1);
            list(name, v);
            code.uint8(opcode);
            code.uint30(v);
        }

        function I_setlocal(index) { dropOneU30("setlocal", 0x63, index) }
        function I_setglobalslot(index) { dropOneU30("setglobalslot", 0x6F, index) }

        // Instructions that do not change the stack height, with a single opcode byte
        private function dropNone(name, opcode)
        {
            //stack(0);
            list(name);
            code.uint8(opcode);
        }

        function I_bitnot() { dropNone("bitnot", 0x97) }
        function I_checkfilter() { dropNone("checkfilter", 0x78) }
        function I_coerce_a() { dropNone("coerce_a", 0x82) }
        function I_coerce_s() { dropNone("coerce_s", 0x85) }
        function I_convert_b() { dropNone("convert_b", 0x76) }
        function I_convert_d() { dropNone("convert_d", 0x75) }
        function I_convert_i() { dropNone("convert_i", 0x73) }
        function I_convert_o() { dropNone("convert_o", 0x77) }
        function I_convert_s() { dropNone("convert_s", 0x70) }
        function I_convert_u() { dropNone("convert_u", 0x74) }
        function I_decrement() { dropNone("decrement", 0x93) }
        function I_decrement_i() { dropNone("decrement_i", 0xC1) }
        function I_esc_xattr() { dropNone("esc_xattr", 0x72) }
        function I_esc_xelem() { dropNone("esc_xattr", 0x71) }
        function I_increment() { dropNone("increment", 0x91) }
        function I_increment_i() { dropNone("increment_i", 0xC0) }
        function I_kill() { dropNone("kill", 0x08) }
        function I_label() { dropNone("label", 0x09) }
        function I_negate() { dropNone("negate", 0x90) }
        function I_negate_i() { dropNone("negate_i", 0xC4) }
        function I_nop() { dropNone("nop", 0x02) }
        function I_not() { dropNone("not", 0x96) }
        function I_popscope() { dropNone("popscope", 0x1D) }
        function I_returnvoid() { dropNone("returnvoid", 0x47) }
        function I_swap() { dropNone("swap", 0x2B) }
        function I_typeof() { dropNone("typeof", 0x95) }

        // Instructions that do not change the stack height, with an opcode byte 
        // followed by a u30 argument
        private function dropNoneU30(name, opcode, x) {
            //stack(0)
            list(name, x);
            code.uint8(opcode);
            code.uint30(x);
        }

        function I_astype(index) { dropNoneU30("astype", 0x86, index) }
        function I_coerce(index) { dropNoneU30("coerce", 0x80, index) }
        function I_debugfile(index) { dropNoneU30("debugfile", 0xF1, index) }
        function I_debugline(linenum) { dropNoneU30("debugline", 0xF0, linenum) }
        function I_declocal(reg) { dropNoneU30("declocal", 0x94, reg) }
        function I_declocal_i(reg) { dropNoneU30("declocal_i", 0xC3, reg) }
        function I_dxns(index) { dropNoneU30("dxns", 0x06, index) }
        function I_getslot(index) { dropNoneU30("getslot", 0x6C, index) }
        function I_inclocal(reg) { dropNoneU30("inclocal", 0x92, reg) }
        function I_inclocal_i(reg) { dropNoneU30("inclocal_i", 0xC2, reg) }
        function I_istype(index) { dropNoneU30("istype", 0xB2, index) }
        function I_newclass(index) { dropNoneU30("newclass", 0x58, index) }

        // Conditional jumps that pop two words
        private function ifCond2(name, opcode, offset) {
            stack(-2);
            list(name, offset);
            code.uint8(opcode);
            code.int24(offset);  // FIXME
        }

        function I_ifeq(offset) { ifCond2("ifeq", 0x13, offset) }
        function I_ifge(offset) { ifCond2("ifge", 0x18, offset) }
        function I_ifgt(offset) { ifCond2("ifgt", 0x17, offset) }
        function I_ifle(offset) { ifCond2("ifle", 0x16, offset) }
        function I_iflt(offset) { ifCond2("iflt", 0x15, offset) }
        function I_ifne(offset) { ifCond2("ifne", 0x14, offset) }
        function I_ifnge(offset) { ifCond2("ifnge", 0x0F, offset) }
        function I_ifngt(offset) { ifCond2("ifngt", 0x0E, offset) }
        function I_ifnle(offset) { ifCond2("ifnle", 0x0D, offset) }
        function I_ifnlt(offset) { ifCond2("ifnlt", 0x0C, offset) }
        function I_ifstricteq(offset) { ifCond2("ifstricteq", 0x19, offset) }
        function I_ifstrictne(offset) { ifCond2("ifstrictne", 0x1A, offset) }

        // Conditional jumps that pop one word
        private function ifCond1(name, opcode, offset) {
            stack(-1);
            list(name, offset);
            code.uint8(opcode);
            code.int24(offset);  // FIXME
        }

        function I_iffalse(offset) { ifCond1("iffalse", 0x12, offset) }
        function I_iftrue(offset) { ifCond1("iftrue", 0x11, offset) }

        function I_jump(offset) {
            //stack(0);
            list("Jump", offset);
            code.uint8(0x10);
            code.int24(offset);  // FIXME
        }

        private function call(name, opcode, nargs) {
            stack(1-(nargs+2)); /* pop function/receiver/args; push result */
            list(name, nargs);
            code.uint8(opcode);
            code.uint30(nargs);
        }

        function I_call(nargs) { call("call", 0x41, nargs) }
        function I_construct(nargs) { call("construct", 0x42, nargs) }

        function I_constructsuper(nargs) {
            stack(nargs+1); /* pop receiver/args */
            list("constructsuper", nargs);
            code.uint8(0x49);
            code.uint30(nargs);
        }

        private function callIDX(name, opcode, index, nargs) {
            stack(1-(nargs+1)); /* pop receiver/args; push result */
            list(name, index, nargs);
            code.uint8(opcode);
            code.uint30(index);
            code.uint30(nargs);
        }

        function I_callmethod(index, nargs) { callIDX("callmethod", 0x43, index, nargs) }
        function I_callstatic(index, nargs) { callIDX("callstatic", 0x44, index, nargs) }

        private function callMN(name, opcode, index, nargs, hasRTNS, hasRTName, isVoid=false) {
            /* pop receiver/NS?/Name?/args; push result? */
            stack((isVoid ? 0 : 1) - (1 + (hasRTNS ? 1 : 0) + (hasRTName ? 1 : 0) + nargs));
            list(name + (hasRTNS ? "<NS>" : "") + (hasRTName ? "<Name>" : ""), index, nargs);
            code.uint8(opcode);
            code.uint30(index);
            code.uint30(nargs);
        }

        function I_callsuper(index, nargs, hasRTNS, hasRTName) { 
            callMN("callsuper", 0x45, index, nargs, hasRTNS, hasRTName);
        }
        function I_callproperty(index, nargs, hasRTNS, hasRTName) { 
            callMN("callproperty", 0x46, index, nargs, hasRTNS, hasRTName);
        }
        function I_constructprop(index, nargs, hasRTNS, hasRTName) { 
            callMN("constructprop", 0x4A, index, nargs, hasRTNS, hasRTName);
        }
        function I_callproplex(index, nargs, hasRTNS, hasRTName) { 
            callMN("callproplex", 0x4C, index, nargs, hasRTNS, hasRTName);
        }
        function I_callsupervoid(index, nargs, hasRTNS, hasRTName) { 
            callMN("callsupervoid", 0x4E, index, nargs, hasRTNS, hasRTName, true);
        }
        function I_callpropvoid(index, nargs, hasRTNS, hasRTName) { 
            callMN("callpropvoid", 0x4F, index, nargs, hasRTNS, hasRTName, true);
        }

        function I_debug(debug_type, index, reg, extra=0) {
            //stack(0);
            list("debug", debug_type, index, reg, extra);
            code.uint8(0xEF);
            code.uint8(debug_type);
            code.uint30(index);
            code.uint8(reg);
            code.uint30(extra);
        }

        private function propOpU30(name, opcode, v, hasRTNS, hasRTName) {
            /* pop object/NS?/Name?; push result */
            stack(1 - (1 + (hasRTNS ? 1 : 0) + (hasRTName ? 1 : 0)));
            list(name + (hasRTNS ? "<NS>" : "") + (hasRTName ? "<Name>" : ""), v);
            code.uint8(opcode);
            code.uint30(v);
        }

        function I_deleteproperty(index, hasRTNS, hasRTName) { 
            propOpU30("deleteproperty", 0x6A, index, hasRTNS, hasRTName);
        }
        function I_getdescendants(index, hasRTNS, hasRTName) { 
            propOpU30("getdescendants", 0x59, index, hasRTNS, hasRTName);
        }
        function I_getproperty(index, hasRTNS, hasRTName) { 
            propOpU30("getproperty", 0x66, index, hasRTNS, hasRTName);
        }
        function I_getsuper(index, hasRTNS, hasRTName) { 
            propOpU30("getsuper", 0x04, index, hasRTNS, hasRTName);
        }

        function I_findproperty(hasRTNS, hasRTName) { 
            /* pop NS?/Name?; push result */
            stack(1 - ((hasRTNS ? 1 : 0) + (hasRTName ? 1 : 0)));
            list("findproperty" + (hasRTNS ? "<NS>" : "") + (hasRTName ? "<Name>" : ""));
            code.uint8(0x5E);
        }

        function I_findpropstrict(index, hasRTNS, hasRTName) { 
            /* pop NS?/Name?; push result */
            stack(1 - ((hasRTNS ? 1 : 0) + (hasRTName ? 1 : 0)));
            list("findpropstrict" + (hasRTNS ? "<NS>" : "") + (hasRTName ? "<Name>" : ""), index);
            code.uint8(0x5D);
            code.uint30(index);
        }

        private function setprop(name, opcode, index, hasRTNS, hasRTName) {
            /* pop object/NS?/Name?/value */
            stack(- (2 + (hasRTNS ? 1 : 0) + (hasRTName ? 1 : 0)));
            list(name + (hasRTNS ? "<NS>" : "") + (hasRTName ? "<Name>" : ""), index);
            code.uint8(opcode);
            code.uint30(index);
        }

        function I_initproperty(index, hasRTNS, hasRTName) {
            setprop("initproperty", 0x68, index, hasRTNS, hasRTName);
        }
        function I_setproperty(index, hasRTNS, hasRTName) {
            setprop("setproperty", 0x61, index, hasRTNS, hasRTName);
        }
        function I_setsuper(index, hasRTNS, hasRTName) {
            setprop("setsuper", 0x05, index, hasRTNS, hasRTName);
        }

        function I_hasnext2(object_reg, index_reg) {
            stack(1);
            code.uint8(0x32);
            code.uint30(object_reg);
            code.uint30(index_reg);
        }

        function I_lookupswitch(default_offset, cases) {
            assert(cases.length > 0);
            stack(-1);
            list("lookupswitch", default_offset, cases);
            code.uint8(0x1B);
            code.int24(default_offset);  // FIXME
            code.uint30(cases.length-1);
            for ( var i=0 ; i < cases.length ; i++ )
                code.int24(cases[i]);
        }

        function I_newarray(nargs) {
            stack(1 - nargs);
            list("newarray", nargs);
            code.uint8(0x56);
            code.uint30(nargs);
        }

        function I_newobject(nargs) {
            stack(1 - (2 * nargs));
            list("newobject", nargs);
            code.uint8(0x55);
            code.uint30(nargs);
        }

        function I_pushbyte(b) {
            stack(1);
            list("pushbyte", b);
            code.uint8(0x24);
            code.uint8(b);
        }

        function I_setslot(index) {
            stack(-2);
            list("setslot", index);
            code.uint8(0x6D);
            code.uint30(index);
        }

        function getTemp() {
            if (freeTemps.length > 0)
                return freeTemps.pop();
            else
                return nextTemp++;
        }

        function killTemp(t) {
            freeTemps.push(t);
            I_kill(t);
        }

        function get length() {
            print("LENGTH: " + code.length);
            return code.length;
        }

        function serialize(bs) {
            code.serialize(bs);
        }

        private function stack(size:int):void {
            current_stack_depth += size;
            if (current_stack_depth > max_stack_depth)
                max_stack_depth = current_stack_depth;
        }

        private var code = new ABCByteStream;
        private var scope_depth = 1;
        private var current_stack_depth = 0;
        private var max_stack_depth = 0;
        private var nextTemp;
        private var freeTemps = [];
        private var constants;
    }

    public function testABCAssembler() {
        //testCoverage();
        testHello();
    }

    function testHello() {
        var cp = new ABCConstantPool();

        var file = new ABCFile();
        file.addConstants(cp);

        // BUG: passing 0 for the namespace causes the AVM to crash, though
        // the doc says it's legal.
        // BUG: passing 0 for the empty string causes the program not to run, though
        // the doc at least implies it's legal.
        var print_name = cp.QName(cp.namespace(CONSTANT_PackageNamespace, cp.stringUtf8("")), 
                                  cp.stringUtf8("print"));

        var asm = new ABCAssembler(cp,0);
        asm.I_getlocal_0();
        asm.I_pushscope();
        asm.I_findpropstrict(print_name, false, false);
        asm.I_pushstring(cp.stringUtf8("Hello, world!"));
        asm.I_callpropvoid(print_name, 1, false, false);
        asm.I_returnvoid();

        var meth = file.addMethod(new ABCMethodInfo(0, [], 0, 0));
        var script = new ABCScriptInfo;
        script.setInit(meth);
        file.addScript(script);
        var body = new ABCMethodBodyInfo(meth);
        body.setMaxStack(2);       // FIXME: Should not have to compute this, assembler should provide it
        body.setLocalCount(1);     // FIXME: compute this?  Must be at least one more than the number of params
        body.setInitScopeDepth(0); // FIXME: useful default?
        body.setMaxScopeDepth(1);  // FIXME: should not have to compute this?
        body.setCode(asm);
        file.addMethodBody(body);

        // Run it!
        {
            import avmplus.Domain;
            var domain = Domain.currentDomain;
            domain.loadBytes(file.getBytes());
            //dumpByteStream(file.getBytes());
        }
    }

    function testCoverage() {
        var cp = new ABCConstantPool();
        var asm = new ABCAssembler(cp,0);

        asm.I_dup();
        asm.I_getglobalscope();
        asm.I_getlocal_0();
        asm.I_getlocal_1();
        asm.I_getlocal_2();
        asm.I_getlocal_3();
        asm.I_newactivation();
        asm.I_pushfalse();
        asm.I_pushnan();
        asm.I_pushnull();
        asm.I_pushtrue();
        asm.I_pushundefined();
        asm.I_getglobalslot(0);
        asm.I_getlex(0);
        asm.I_getlocal(0);
        asm.I_getscopeobject(0);
        asm.I_newcatch(0);
        asm.I_newfunction(0);
        asm.I_pushdouble(0);
        asm.I_pushint(0);
        asm.I_pushnamespace(0);
        asm.I_pushshort(0);
        asm.I_pushstring(0);
        asm.I_pushuint(0);
        asm.I_add();
        asm.I_add_i();
        asm.I_astypelate();
        asm.I_bitand();
        asm.I_bitor();
        asm.I_bitxor();
        asm.I_divide();
        asm.I_dxnslate();
        asm.I_equals();
        asm.I_greaterequals();
        asm.I_greaterthan();
        asm.I_hasnext();
        asm.I_in();
        asm.I_instanceof();
        asm.I_istypelate();
        asm.I_lessequals();
        asm.I_lessthan();
        asm.I_lshift();
        asm.I_modulo();
        asm.I_multiply();
        asm.I_multiply_i();
        asm.I_nextname();
        asm.I_nextvalue();
        asm.I_pop();
        asm.I_pushscope();
        asm.I_pushwith();
        asm.I_returnvalue();
        asm.I_rshift();
        asm.I_setlocal_0();
        asm.I_setlocal_1();
        asm.I_setlocal_2();
        asm.I_setlocal_3();
        asm.I_strictequals();
        asm.I_subtract();
        asm.I_subtract_i();
        asm.I_throw();
        asm.I_urshift();
        asm.I_setlocal(0);
        asm.I_setglobalslot(0);
        asm.I_bitnot();
        asm.I_checkfilter();
        asm.I_coerce_a();
        asm.I_coerce_s();
        asm.I_convert_b();
        asm.I_convert_d();
        asm.I_convert_i();
        asm.I_convert_o();
        asm.I_convert_s();
        asm.I_convert_u();
        asm.I_decrement();
        asm.I_decrement_i();
        asm.I_esc_xattr();
        asm.I_esc_xelem();
        asm.I_increment();
        asm.I_increment_i();
        asm.I_kill();
        asm.I_label();
        asm.I_negate();
        asm.I_negate_i();
        asm.I_nop();
        asm.I_not();
        asm.I_popscope();
        asm.I_returnvoid();
        asm.I_swap();
        asm.I_typeof();
        asm.I_astype(0);
        asm.I_coerce(0);
        asm.I_debugfile(0);
        asm.I_debugline(0);
        asm.I_declocal(0);
        asm.I_declocal_i(0);
        asm.I_dxns(0);
        asm.I_getslot(0);
        asm.I_inclocal(0);
        asm.I_inclocal_i(0);
        asm.I_istype(0);
        asm.I_newclass(0);
        asm.I_ifeq(0);
        asm.I_ifge(0);
        asm.I_ifgt(0);
        asm.I_ifle(0);
        asm.I_iflt(0);
        asm.I_ifne(0);
        asm.I_ifnge(0);
        asm.I_ifngt(0);
        asm.I_ifnle(0);
        asm.I_ifnlt(0);
        asm.I_ifstricteq(0);
        asm.I_ifstrictne(0);
        asm.I_iffalse(0);
        asm.I_iftrue(0);
        asm.I_jump(0);
        asm.I_call(0);
        asm.I_construct(0);
        asm.I_constructsuper(0);
        asm.I_callmethod(0, 0);
        asm.I_callstatic(0, 0);
        asm.I_callsuper(0, 0, false, false);
        asm.I_callproperty(0, 0, false, true);
        asm.I_constructprop(0, 0, true, false);
        asm.I_callproplex(0, 0, true, true);
        asm.I_callsupervoid(0, 0, true, false);
        asm.I_callpropvoid(0, 0, false, true);
        asm.I_debug(0, 0, 0, 0);
        asm.I_deleteproperty(0, true, false);
        asm.I_getdescendants(0, false, true);
        asm.I_getproperty(0, false, false);
        asm.I_getsuper(0, true, true);
        asm.I_findproperty(true, true);
        asm.I_findpropstrict(0, false, false);
        asm.I_initproperty(0, true, false);
        asm.I_setproperty(0, false, true);
        asm.I_setsuper(0, true, true);
        asm.I_hasnext2(0, 0);
        asm.I_lookupswitch(0, [1,2,3]);
        asm.I_newarray(0);
        asm.I_newobject(0);
        asm.I_pushbyte(0);
        asm.I_setslot(0);
    }
}
