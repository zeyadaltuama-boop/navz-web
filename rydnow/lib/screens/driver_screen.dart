import 'package:flutter/material.dart';

class DriverScreen extends StatelessWidget {
  const DriverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Driver Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _card('Today Earnings', '€124.50'),
            _card('This Week', '€842.00'),
            _card('Price per km', '€1.20'),
            _card('Availability', 'ONLINE'),

            const SizedBox(height: 20),

            ElevatedButton(
              onPressed: () {},
              child: const Text('Edit Profile'),
            ),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Set Pricing'),
            ),
            ElevatedButton(
              onPressed: () {},
              child: const Text('View Ride History'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _card(String title, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade900,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
