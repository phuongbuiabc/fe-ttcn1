
import json

with open(r'C:\Users\Lenovo\.gemini\antigravity\brain\f664eb42-0b0a-48a2-a199-3371cf355ad8\.system_generated\steps\637\content.md', 'r', encoding='utf-8') as f:
    content = f.read()
    # Skip the "Source: ..." header
    json_start = content.find('{')
    json_data = json.loads(content[json_start:])
    
    schema = json_data['components']['schemas'].get('RegisterRequest')
    print("RegisterRequest Keys:", ", ".join(schema['properties'].keys()))








