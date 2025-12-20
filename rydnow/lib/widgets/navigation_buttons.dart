import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class NavigationButtons extends StatelessWidget {
  const NavigationButtons({super.key});

  void _open(String url) {
    launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text('Navigate with'),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            TextButton(onPressed: () => _open('http://maps.apple.com'), child: const Text('Apple')),
            TextButton(onPressed: () => _open('https://maps.google.com'), child: const Text('Google')),
            TextButton(onPressed: () => _open('https://waze.com'), child: const Text('Waze')),
          ],
        ),
      ],
    );
  }
}
