import 'dart:convert';
import 'package:http/http.dart' as http;

class GooglePlacesService {
  static const String _apiKey = 'AIzaSyDfjCTcghGrXHoR6aWHMzBHQsnJa3vqhM0';

  static Future<List<String>> autocomplete(String input) async {
    if (input.isEmpty) return [];

    final url =
        'https://maps.googleapis.com/maps/api/place/autocomplete/json'
        '?input=$input'
        '&types=geocode'
        '&key=$_apiKey';

    final response = await http.get(Uri.parse(url));
    final data = json.decode(response.body);

    if (data['status'] != 'OK') return [];

    return (data['predictions'] as List)
        .map((p) => p['description'] as String)
        .toList();
  }
}
