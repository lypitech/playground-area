import 'package:go_router/go_router.dart';
import 'package:test_flutter/navigation/home_page.dart';
import 'package:test_flutter/navigation/login_page.dart';

class Router {

  final GoRouter router = GoRouter(
    routes: <GoRoute>[
      GoRoute(
        path: '/',
        routes: <GoRoute>[
          GoRoute(
            path: '/login',
            builder: (_, _) {
              return LoginPage();
            }
          )
        ],
        builder: (_, _) {
          return HomePage();
        }
      )
    ]
  );

}
