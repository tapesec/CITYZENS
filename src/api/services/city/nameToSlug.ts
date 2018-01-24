const nameToSlug = (name: string) => {
    return name.replace(new RegExp('[ \']'), '-').toLowerCase();
};

export default nameToSlug;
