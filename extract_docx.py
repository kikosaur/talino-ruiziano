import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def get_docx_text(path):
    try:
        document = zipfile.ZipFile(path)
        xml_content = document.read('word/document.xml')
        document.close()
        tree = ET.XML(xml_content)
        
        paragraphs = []
        for paragraph in tree.iter():
            # w:t tag contains text
            if paragraph.tag.endswith('}t'):
                if paragraph.text:
                    paragraphs.append(paragraph.text)
            # w:p tag typically starts a new paragraph, but splitting by 't' tags 
            # might merge words if we are not careful. 
            # Better approach: Iterate over paragraphs (w:p) and join texts within them.
        
        # Re-parsing for better structure
        text_content = []
        
        # Namespaces in the XML
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        for p in tree.iterfind('.//w:p', ns):
            texts = [node.text for node in p.iterfind('.//w:t', ns) if node.text]
            if texts:
                text_content.append(''.join(texts))
                
        return '\n'.join(text_content)
    except Exception as e:
        return f"Error reading .docx file: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <filename>")
        sys.exit(1)
        
    filename = sys.argv[1]
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        sys.exit(1)
        
    print(get_docx_text(filename))
