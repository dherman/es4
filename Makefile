es4.heap:
	ml-build es4.cm Main.main es4.heap


check: es4.heap
	sml @SMLload=es4.heap tests/ident.js