import 'package:flutter/material.dart';
import 'package:test_flutter/navigation/home_page.dart';

class App extends StatelessWidget {

  const App({ super.key });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AREA - Flutter demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const HomePage(),
    );
  }

}
