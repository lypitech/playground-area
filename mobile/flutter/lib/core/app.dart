import 'package:flutter/material.dart' hide Router;
import 'package:test_flutter/core/router/router.dart';

class App extends StatelessWidget {

  App({ super.key });

  final Router _appRouter = Router();

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: _appRouter.router,
      title: 'AREA - Flutter Demo',
      debugShowCheckedModeBanner: true,
    );
  }

}
