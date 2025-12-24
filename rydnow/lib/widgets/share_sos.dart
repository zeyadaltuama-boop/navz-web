import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class ShareAndSOS extends StatelessWidget {
  const ShareAndSOS({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: _shareJourney,
          child: const Text('Share Journey'),
        ),
        const SizedBox(height: 10),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
            foregroundColor: Colors.white,
          ),
          onPressed: _callSOS,
          child: const Text('SOS'),
        ),
      ],
    );
  }

  void _shareJourney() {
    SharePlus.instance.share(
      ShareParams(
        text: 'Track my ride with NAVZ',
      ),
    );
  }

  void _callSOS() async {
    final uri = Uri.parse('tel:112');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }
}
