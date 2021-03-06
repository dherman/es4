(*
 * The following licensing terms and conditions apply and must be
 * accepted in order to use the Reference Implementation:
 *
 *    1. This Reference Implementation is made available to all
 * interested persons on the same terms as Ecma makes available its
 * standards and technical reports, as set forth at
 * http://www.ecma-international.org/publications/.
 *
 *    2. All liability and responsibility for any use of this Reference
 * Implementation rests with the user, and not with any of the parties
 * who contribute to, or who own or hold any copyright in, this Reference
 * Implementation.
 *
 *    3. THIS REFERENCE IMPLEMENTATION IS PROVIDED BY THE COPYRIGHT
 * HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN
 * IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * End of Terms and Conditions
 *
 * Copyright (c) 2007 Adobe Systems Inc., The Mozilla Foundation, Opera
 * Software ASA, and others.
 *)
structure Name = struct

val (opaqueNsCounter:int ref) = ref 0
fun newOpaqueNS _ =
    (* safe: will raise Overflow when we run out of namespaces. *)
    (opaqueNsCounter := (!opaqueNsCounter) + 1;
     (Ast.OpaqueNamespace (!opaqueNsCounter)))
	
val ES4NS = newOpaqueNS ()
val publicNS = Ast.TransparentNamespace Ustring.empty
val metaNS = newOpaqueNS ()
val magicNS = newOpaqueNS ()
val intrinsicNS = newOpaqueNS ()
val informativeNS = newOpaqueNS ()
val ECMAScript4_InternalNS = newOpaqueNS ()
val helperNS = newOpaqueNS ()
val UnicodeNS = newOpaqueNS ()
val RegExpInternalsNS = newOpaqueNS ()

fun public (id:Ast.IDENTIFIER) : Ast.NAME = { id = id, ns = publicNS }
fun ES4 (id:Ast.IDENTIFIER) : Ast.NAME = { id = id, ns = ES4NS }
fun meta (id:Ast.IDENTIFIER) : Ast.NAME = { id = id, ns = metaNS }
fun magic (id:Ast.IDENTIFIER) : Ast.NAME = { id = id, ns = magicNS }
fun intrinsic (id:Ast.IDENTIFIER) : Ast.NAME = { id = id, ns = intrinsicNS }
fun helper (id:Ast.IDENTIFIER) : Ast.NAME = { id = id, ns = helperNS }
fun informative (id:Ast.IDENTIFIER) : Ast.NAME = { id = id, ns = informativeNS }

(*
 * To reference a name as a type expression, you need
 * a complicated structure.
 *)

fun typename (n:Ast.NAME) =
    Ast.TypeName (Ast.QualifiedName
					  { identifier = (#id n),
						namespace = Ast.Namespace (#ns n) }, NONE)


fun nameExprOf (n:Ast.NAME) =
    Ast.QualifiedName { namespace = Ast.Namespace (#ns n), 
                        identifier = (#id n) }


(* 
 * These are the names that the per-class opaque namespaces 
 * 'private' and 'protected' get bound to *inside* the fixtureMap 
 * of a given class. You pass in the private namespace
 *)
fun private privateClassNs = { ns=privateClassNs, id=Ustring.private_ }
fun protected privateClassNs = { ns=privateClassNs, id=Ustring.protected_ }

																		   
(*
 * Names that are supposed to be present in the global scope
 * once we finish booting.
 *)

(* From MetaObjects.es *)
val intrinsic_Type = intrinsic Ustring.Type_

(* From Interface.es -- going away. *)
val intrinsic_Interface = intrinsic Ustring.Interface_

(* From Class.es -- going away. *)
val intrinsic_Class = intrinsic Ustring.Class_

(* From Namespace.es *)
val ES4_Namespace = ES4 Ustring.Namespace_

(* From Name.es *)
val ES4_Name = ES4 Ustring.Name_
val public_qualifier = public Ustring.qualifier_
val public_identifier = public Ustring.identifier_

(* From Object.es *)
val public_Object = public Ustring.Object_

(* From Error.es *)
val public_Error = public Ustring.Error_
val public_EvalError = public Ustring.EvalError_
val public_RangeError = public Ustring.RangeError_
val public_ReferenceError = public Ustring.ReferenceError_
val public_SyntaxError = public Ustring.SyntaxError_
val public_TypeError = public Ustring.TypeError_

(* From Conversions.es *)
val intrinsic_ToPrimitive = intrinsic Ustring.ToPrimitive_

(* From Global.es *)
val intrinsic_NaN = intrinsic Ustring.NaN_
val intrinsic_Infinity = intrinsic Ustring.Infinity_
val intrinsic_undefined = intrinsic Ustring.undefined_
val intrinsic_eval = intrinsic Ustring.eval_
val intrinsic_parseInt = intrinsic Ustring.parseInt_
val intrinsic_parseFloat = intrinsic Ustring.parseFloat_
val intrinsic_isNaN = intrinsic Ustring.isNaN_
val intrinsic_isFinite = intrinsic Ustring.isFinite_
val intrinsic_decodeURI = intrinsic Ustring.decodeURI_
val intrinsic_decodeURIComponent = intrinsic Ustring.decodeURIComponent_
val intrinsic_encodeURI = intrinsic Ustring.encodeURI_
val intrinsic_encodeURIComponent = intrinsic Ustring.encodeURIComponent_

val public_next = public Ustring.next_

val public_NaN = public Ustring.NaN_
val public_Infinity = public Ustring.Infinity_
val public_undefined = public Ustring.undefined_
val public_eval = public Ustring.eval_
val public_parseInt = public Ustring.parseInt_
val public_parseFloat = public Ustring.parseFloat_
val public_isNaN = public Ustring.isNaN_
val public_isFinite = public Ustring.isFinite_
val public_decodeURI = public Ustring.decodeURI_
val public_decodeURIComponent = public Ustring.decodeURIComponent_
val public_encodeURI = public Ustring.encodeURI_
val public_encodeURIComponent = public Ustring.encodeURIComponent_

val intrinsic_print = intrinsic Ustring.print_
val intrinsic_load = intrinsic Ustring.load_
val intrinsic_assert = intrinsic Ustring.assert_
val intrinsic_typename = intrinsic Ustring.typename_
val intrinsic_readFile = intrinsic Ustring.readFile_
val intrinsic_writeFile = intrinsic Ustring.writeFile_
val intrinsic_readHTTP = intrinsic Ustring.readHTTP_
val intrinsic_explodeDouble = intrinsic Ustring.explodeDouble_

(* From Function.es *)
val public_Function = public Ustring.Function_

(* From Boolean.es *)
val public_Boolean = public Ustring.Boolean_
val ES4_AnyBoolean = ES4 Ustring.AnyBoolean_

(* From boolean_primitive.es *)
val ES4_boolean = ES4 Ustring.boolean_

(* From Number.es *)
val public_Number = public Ustring.Number_
val ES4_AnyNumber = ES4 Ustring.AnyNumber_

(* From double.es *)
val ES4_double = ES4 Ustring.double_

(* From decimal.es *)
val ES4_decimal = ES4 Ustring.decimal_

(* From String.es *)
val public_String = public Ustring.String_
val ES4_AnyString = ES4 Ustring.AnyString_

(* From string_primitive.es *)
val ES4_string = ES4 Ustring.string_

(* From Array.es *)
val public_Array = public Ustring.Array_

(* From Date.es *)
val public_Date = public Ustring.Date_

(* From RegExp.es *)
val public_RegExp = public Ustring.RegExp_

(* From DecimalContext.es *)
val ES4_DecimalContext = ES4 Ustring.DecimalContext_
val public_precision = public Ustring.precision_
val public_mode = public Ustring.mode_


(*
 * Natives
 *)

val intrinsic_id = intrinsic Ustring.id_
val intrinsic_proto = intrinsic Ustring.proto_
val intrinsic_dumpFunc = intrinsic Ustring.dumpFunc_
val intrinsic_inspect = intrinsic Ustring.inspect_
val intrinsic_random = intrinsic Ustring.random_
val informative_acosDouble = informative Ustring.acosDouble_
val informative_acosDecimal = informative Ustring.acosDecimal_
val informative_asinDouble = informative Ustring.asinDouble_
val informative_asinDecimal = informative Ustring.asinDecimal_
val informative_atanDouble = informative Ustring.atanDouble_
val informative_atanDecimal = informative Ustring.atanDecimal_
val informative_atan2Double = informative Ustring.atan2Double_
val informative_atan2Decimal = informative Ustring.atan2Decimal_
val informative_ceilDouble = informative Ustring.ceilDouble_
val informative_ceilDecimal = informative Ustring.ceilDecimal_
val informative_cosDouble = informative Ustring.cosDouble_
val informative_cosDecimal = informative Ustring.cosDecimal_
val informative_expDouble = informative Ustring.expDouble_
val informative_expDecimal = informative Ustring.expDecimal_
val informative_floorDouble = informative Ustring.floorDouble_
val informative_floorDecimal = informative Ustring.floorDecimal_
val informative_logDouble = informative Ustring.logDouble_
val informative_logDecimal = informative Ustring.logDecimal_
val informative_powDouble = informative Ustring.powDouble_
val informative_powDecimal = informative Ustring.powDecimal_
val informative_roundDouble = informative Ustring.roundDouble_
val informative_roundDecimal = informative Ustring.roundDecimal_
val informative_sinDouble = informative Ustring.sinDouble_
val informative_sinDecimal = informative Ustring.sinDecimal_
val informative_sqrtDouble = informative Ustring.sqrtDouble_
val informative_sqrtDecimal = informative Ustring.sqrtDecimal_
val informative_tanDouble = informative Ustring.tanDouble_
val informative_tanDecimal = informative Ustring.tanDecimal_
val informative_objectHash = informative Ustring.objectHash_
val intrinsic_now = intrinsic Ustring.now_
val intrinsic_toPrecision = intrinsic Ustring.toPrecision_
val intrinsic_toExponential = intrinsic Ustring.toExponential_
val intrinsic_toFixedStep10 = intrinsic Ustring.toFixedStep10_
val intrinsic_set = intrinsic Ustring.set_
val intrinsic_get = intrinsic Ustring.get_

val intrinsic_DaylightSavingsTA = intrinsic Ustring.DaylightSavingsTA_
val intrinsic_LocalTZA = intrinsic Ustring.LocalTZA_

val informative_stringAppend = informative Ustring.stringAppend_
val informative_stringLength = informative Ustring.stringLength_
val informative_fromCharCode = informative Ustring.fromCharCode_
val informative_charCodeAt = informative Ustring.charCodeAt_

val helper_fnLength = helper Ustring.fnLength_
val helper_genSend = helper Ustring.genSend_
val helper_genThrow = helper Ustring.genThrow_
val helper_genClose = helper Ustring.genClose_
val helper_apply = helper Ustring.apply_

val helper_DefaultBehavior = helper Ustring.DefaultBehavior_
val helper_DefaultBehaviorClass = helper Ustring.DefaultBehaviorClass_

val helper_toPrimitive = helper Ustring.toPrimitive_
val helper_isPrimitive = helper Ustring.isPrimitive_
val helper_defaultValue = helper Ustring.defaultValue_
val helper_setPropertyIsEnumerable = helper Ustring.setPropertyIsEnumerable_
val helper_getPropertyIsRemovable = helper Ustring.getPropertyIsRemovable_
val helper_getPropertyIsEnumerable = helper Ustring.getPropertyIsEnumerable_
val helper_hasOwnProperty = helper Ustring.hasOwnProperty_
val helper_getPrototype = helper Ustring.getPrototype_
val helper_getSuperClass = helper Ustring.getSuperClass_
val helper_getSuperInterface = helper Ustring.getSuperInterface_
val helper_getImplementedInterface = helper Ustring.getImplementedInterface_
val helper_getEnumerableIds = helper Ustring.getEnumerableIds_
val helper_getClassOfObject = helper Ustring.getClassOfObject_
val helper_InterfaceTypeImpl = helper Ustring.InterfaceTypeImpl_						
val helper_ClassTypeImpl = helper Ustring.ClassTypeImpl_
val informative_getClassName = informative Ustring.getClassName_
val helper_construct = helper Ustring.construct_

(*
 * Property names that have special meanings to the interpreter.
 *)

val public_constructor = public Ustring.constructor_
val public_length = public Ustring.length_
val public_cursor = public Ustring.cursor_
val public_source = public Ustring.source_
val public_prototype = public Ustring.prototype_
val public_toString = public Ustring.toString_
val public_valueOf = public Ustring.valueOf_
val public_global = public Ustring.global_
val meta_invoke = meta Ustring.invoke_
val meta_get = meta Ustring.get_
val meta_set = meta Ustring.set_
val meta_has = meta Ustring.has_
val meta_call = meta Ustring.call_
val meta_delete = meta Ustring.delete_

val public_arguments = public Ustring.arguments_
val helper_argsLength = helper Ustring.argsLength_
val helper_getArg = helper Ustring.getArg_
val helper_setArg = helper Ustring.setArg_

val public_empty = public Ustring.empty

(* These are the property names that are opaque namespaces themselves are bound under. *)
val public_ES4 = public Ustring.ES4_

val ES4_public = ES4 Ustring.public_
val ES4_meta = ES4 Ustring.meta_
val ES4_helper = ES4 Ustring.helper_
val ES4_intrinsic = ES4 Ustring.intrinsic_
val ES4_iterator = ES4 Ustring.iterator_
val ES4_informative = ES4 Ustring.informative_
val ES4_Unicode = ES4 Ustring.Unicode_
val ES4_RegExpInternals = ES4 Ustring.RegExpInternals_
val ES4_internal = ES4 Ustring.internal_

val helper_Arguments = helper Ustring.Arguments_

val helper_GeneratorImpl = helper Ustring.GeneratorImpl_

end
