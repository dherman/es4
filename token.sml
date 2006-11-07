structure Token = struct

datatype token = 

    (* punctuators *)

      MINUS
    | MINUSMINUS
    | NOT
    | NOTEQUALS
    | STRICTNOTEQUALS
    | MODULUS
    | MODULUSASSIGN
    | BITWISEAND
    | LOGICALAND
    | LOGICALANDASSIGN
    | BITWISEANDASSIGN
    | LEFTPAREN
    | RIGHTPAREN
    | MULT
    | MULTASSIGN
    | COMMA
    | DOT
    | DOUBLEDOT
    | TRIPLEDOT
    | LEFTDOTANGLE
    | DIV
    | DIVASSIGN
    | COLON
    | DOUBLECOLON
    | SEMICOLON
    | QUESTIONMARK
    | AT
    | LEFTBRACKET
    | RIGHTBRACKET
    | BITWISEXOR
    | LOGICALXOR
    | LOGICALXORASSIGN
    | BITWISEXORASSIGN
    | LEFTBRACE
    | BITWISEOR
    | LOGICALOR
    | LOGICALORASSIGN
    | BITWISEORASSIGN
    | RIGHTBRACE
    | BITWISENOT
    | PLUS
    | PLUSPLUS
    | PLUSASSIGN
    | LESSTHAN
    | LEFTSHIFT
    | LEFTSHIFTASSIGN
    | LESSTHANOREQUALS
    | ASSIGN
    | MINUSASSIGN
    | EQUALS
    | STRICTEQUALS
    | GREATERTHAN
    | GREATERTHANOREQUALS
    | RIGHTSHIFT
    | RIGHTSHIFTASSIGN
    | UNSIGNEDRIGHTSHIFT
    | UNSIGNEDRIGHTSHIFTASSIGN

    (* reserved identifiers *)

    | AS
    | BREAK
    | CASE
    | CAST
    | CATCH
    | CLASS
    | CONST
    | CONTINUE
    | DEFAULT
    | DELETE
    | DO
    | ELSE
    | ENUM
    | EXTENDS
    | FALSE
    | FINALLY
    | FOR
    | FUNCTION
    | IF
    | IMPLEMENTS
    | IMPORT
    | IN
    | INSTANCEOF
    | INTERFACE
    | INTERNAL
    | INTRINSIC
    | IS
    | LET
    | NEW
    | NULL
    | PACKAGE
    | PRIVATE
    | PROTECTED
    | PUBLIC
    | RETURN
    | SUPER
    | SWITCH
    | THIS
    | THROW
    | TO
    | TRUE
    | TRY
    | TYPEOF
    | USE
    | VAR
    | VOID
    | WHILE
    | WITH

    (* contextually reserved identifiers
     
     Currently adopting the strategy of returning these
     as IDENTIFIER tokens and letting the parser decide
     how to interpret them.

    | CALL
    | DEBUGGER
    | DECIMAL
    | DOUBLE
    | DYNAMIC
    | EACH
    | FINAL
    | GET
    | GOTO
    | INCLUDE
    | INT
    | NAMESPACE
    | NATIVE
    | NUMBER
    | OVERRIDE
    | PROTOTYPE
    | ROUNDING
    | STANDARD
    | STRICT
    | UINT
    | SET
    | STATIC
    | TYPE
    | XML
    | YIELD

     *)

    (* literals *)

    | ATTRIBUTEIDENTIFIER
    | BLOCKCOMMENT
    | DOCCOMMENT
    | EOL
    | IDENTIFIER of string
    | NUMBERLITERAL of real
    | PACKAGEIDENTIFIER
    | REGEXPLITERAL
    | SLASHSLASHCOMMENT
    | STRINGLITERAL of string
    | WHITESPACE
    | XMLLITERAL
    | XMLPART
    | XMLMARKUP
    | XMLTEXT
    | XMLTAGENDEND
    | XMLTAGSTARTEND

    (* meta *)

    | EMPTY
    | ERROR

end