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
structure NameKey = struct

type ord_key = Ast.NAME

fun cmpNS (Ast.OpaqueNamespace _, Ast.TransparentNamespace _) = LESS
  | cmpNS (Ast.TransparentNamespace _, Ast.OpaqueNamespace _) = GREATER
  | cmpNS (Ast.OpaqueNamespace i, Ast.OpaqueNamespace j) = Int.compare (i, j)
  | cmpNS (Ast.TransparentNamespace i, Ast.TransparentNamespace j) = Ustring.compare i j

(* FIXME: SML.NET doesn't implement List.collate *)
fun collate (cmp:('a * 'a -> order))
            ((ls1:'a list), (ls2:'a list))
    : order =
    (case (ls1, ls2) of
     ([], []) => EQUAL
       | ([], _) => LESS
       | (_, []) => GREATER
       | ((x::ls1'), (y::ls2')) =>
         (case (cmp (x, y)) of
          EQUAL => collate cmp (ls1', ls2')
            | ord => ord))

fun compare (a:ord_key, b:ord_key)
    : order =
    case Ustring.compare (#id a) (#id b) of
		LESS => LESS
      | GREATER => GREATER
      | EQUAL => cmpNS ((#ns a), (#ns b))
				 
end
