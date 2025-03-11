def modify_and_write_file(input_filename, output_filename):
    try:
        with open(input_filename, 'r') as infile, open(output_filename, 'w') as outfile:
            for line in infile:
                # Example modification: Upper case all characters in the line
                modified_line = line.upper()
                outfile.write(modified_line)
        print(f"File '{input_filename}' successfully modified and written to '{output_filename}'.")

    except FileNotFoundError:
        print(f"Error: File '{input_filename}' not found.")
    except PermissionError:
        print(f"Error: Permission denied to read '{input_filename}' or write '{output_filename}'.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
while True:
    input_filename = input("Enter the input filename: ")
    output_filename = input("Enter the output filename: ")

    try:
        with open(input_filename, 'r'): #Check if the file exists and is readable
            break
    except FileNotFoundError:
        print(f"Error: File '{input_filename}' not found. Please try again.")
    except PermissionError:
        print(f"Error: Permission denied to read '{input_filename}'. Please try again.")

modify_and_write_file(input_filename, output_filename)