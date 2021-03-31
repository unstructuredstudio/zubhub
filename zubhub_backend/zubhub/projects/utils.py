def parse_comment_trees(data, creators_dict):

    def recursive_parse(data):
        arr = []

        for comment in data:
            parsed = {}
            parsed["id"] = comment["id"]
            parsed["project"] = comment["data"]["project"]
            parsed["creator"] = creators_dict[comment["data"]["creator"]]
            parsed["text"] = comment["data"]["text"]
            parsed["created_on"] = comment["data"]["created_on"]

            children = comment.get("children", [])
            parsed["replies"] = recursive_parse(children)

            arr.append(parsed)
        arr.reverse()
        return arr

    return recursive_parse(data)
